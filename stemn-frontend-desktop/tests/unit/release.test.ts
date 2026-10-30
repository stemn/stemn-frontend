/**
 * Unit tests of the release tooling: feed yml generation / verification, the electron-builder
 * environment overlay (edition, channel, signing), changelog and version handling, and the
 * object-storage feed operations (with a fake rclone).
 */
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parseChangelog, prependRelease, releaseNotesFor } from '../../config/changelog.mjs'
import { AZURE_SIGNING_ENV, builderOverlay, mergeConfig } from '../../scripts/release/lib/builder-overlay.mjs'
import { parseArgs } from '../../scripts/release/lib/cli.mjs'
import {
  channelFile,
  checkUpdateInfo,
  createUpdateInfo,
  fileEntry,
  parseUpdateInfo,
  sha512,
  stringifyUpdateInfo,
  verifyFeed,
} from '../../scripts/release/lib/feed.mjs'
import { bumpVersion, notesFromGitLog } from '../../scripts/release/lib/prepare.mjs'
import {
  compareVersions,
  configuredBuckets,
  liveVersion,
  pointChannelAt,
  previousRelease,
  sortVersions,
} from '../../scripts/release/lib/rclone.mjs'

const CHANGELOG = `# Stemn Desktop changelog

Intro text.

## 1.3.0-beta.1 (2026-11-03)

- Beta thing (#45)

## 1.2.0 (2026-11-01)

- Restart to update (#41)
- EU feed (#42)

## [1.1.0]

- Older
`

describe('changelog', () => {
  it('parses the entries and finds the notes of a version', () => {
    expect(parseChangelog(CHANGELOG).map((entry) => entry.version)).toEqual(['1.3.0-beta.1', '1.2.0', '1.1.0'])
    expect(releaseNotesFor(CHANGELOG, '1.2.0')).toBe('- Restart to update (#41)\n- EU feed (#42)')
    expect(releaseNotesFor(CHANGELOG, '9.9.9')).toBe('')
  })

  it('prepends a new entry after the intro and replaces an existing one', () => {
    const next = prependRelease(CHANGELOG, { version: '1.3.0', date: '2026-11-10', notes: '- Stable' })
    expect(parseChangelog(next).map((entry) => entry.version)).toEqual(['1.3.0', '1.3.0-beta.1', '1.2.0', '1.1.0'])
    expect(next.startsWith('# Stemn Desktop changelog\n\nIntro text.\n\n## 1.3.0 (2026-11-10)\n\n- Stable\n')).toBe(
      true,
    )
    const replaced = prependRelease(next, { version: '1.3.0', date: '2026-11-11', notes: '- Stable, edited' })
    expect(parseChangelog(replaced).filter((entry) => entry.version === '1.3.0')).toHaveLength(1)
    expect(releaseNotesFor(replaced, '1.3.0')).toBe('- Stable, edited')
    expect(parseChangelog(prependRelease('', { version: '1.0.0', notes: '- First' }))).toEqual([
      { version: '1.0.0', heading: '## 1.0.0', body: '- First' },
    ])
  })
})

describe('prepare: versions and notes', () => {
  it('bumps versions', () => {
    expect(bumpVersion('1.2.3', 'patch')).toBe('1.2.4')
    expect(bumpVersion('1.2.3', 'minor')).toBe('1.3.0')
    expect(bumpVersion('1.2.3', 'major')).toBe('2.0.0')
    expect(bumpVersion('1.2.3', 'beta')).toBe('1.2.4-beta.1')
    expect(bumpVersion('1.2.4-beta.1', 'beta')).toBe('1.2.4-beta.2')
    expect(bumpVersion('1.2.4-beta.2', 'patch')).toBe('1.2.4')
    expect(bumpVersion('1.3.0-beta.2', 'minor')).toBe('1.3.0')
    expect(bumpVersion('0.0.26', '1.0.0')).toBe('1.0.0')
    expect(() => bumpVersion('1.2.3', '1.2.3')).toThrow(/not greater/)
    expect(() => bumpVersion('1.2.3', '1.3.0-rc.1')).toThrow(/Unsupported/)
  })

  it('turns merged pull requests into changelog lines', () => {
    const log = [
      'Merge pull request #39 from stemn/fix/http-package\x1fFix the http package import\n\nmore\x1e',
      'Desktop: restart to update (#41)\x1f\x1e',
      "Merge branch 'staging' into feature\x1f\x1e",
      'chore(desktop): release 1.2.0\x1f\x1e',
      'fix: typo\x1f\x1e',
    ].join('\n')
    expect(notesFromGitLog(log)).toBe(
      '- Fix the http package import (#39)\n- Desktop: restart to update (#41)\n- fix: typo',
    )
  })

  it('parses script arguments', () => {
    expect(parseArgs(['1.2.0', '--to', '1.1.0', '--dry-run', '--edition=eu'], { booleans: ['dry-run'] })).toEqual({
      positional: ['1.2.0'],
      options: { to: '1.1.0', 'dry-run': true, edition: 'eu' },
    })
  })
})

describe('electron-builder overlay', () => {
  it('global edition, stable: GitHub provider, notes from the changelog, unsigned', () => {
    const { config, summary } = builderOverlay({}, { version: '1.2.0', changelog: CHANGELOG })
    expect(config.publish).toEqual([{ provider: 'github', owner: 'stemn', repo: 'stemn-desktop' }])
    expect(config.releaseInfo).toEqual({ releaseNotes: '- Restart to update (#41)\n- EU feed (#42)' })
    expect(config.win).toEqual({})
    expect(config.artifactName).toBeUndefined()
    expect(summary).toMatchObject({ channel: 'stable', edition: 'global', windowsSigning: 'none', notarize: 'skipped' })
  })

  it('EU edition, beta: generic EU feed of the beta channel, EU artefact names', () => {
    const { config } = builderOverlay({ STEMN_EDITION: 'eu' }, { version: '1.3.0-beta.1', changelog: CHANGELOG })
    expect(config.publish).toEqual([
      { provider: 'generic', url: 'https://updates.stemn.eu/desktop/beta/', channel: 'beta' },
    ])
    expect(config.artifactName).toBe('${productName}-EU-${version}-${os}-${arch}.${ext}')
  })

  it('refuses to publish a pre-release to stable', () => {
    expect(() => builderOverlay({ UPDATES_CHANNEL: 'stable' }, { version: '1.3.0-beta.1' })).toThrow(/pre-release/)
    expect(() => builderOverlay({ UPDATES_CHANNEL: 'nightly' }, { version: '1.3.0' })).toThrow(
      /Unknown UPDATES_CHANNEL/,
    )
  })

  it('Azure Trusted Signing only when fully configured', () => {
    const env = Object.fromEntries(AZURE_SIGNING_ENV.map((name) => [name, `value-of-${name}`]))
    const { config, summary } = builderOverlay(env, { version: '1.2.0' })
    expect(config.win.azureSignOptions).toEqual({
      endpoint: 'value-of-AZURE_TRUSTED_SIGNING_ENDPOINT',
      codeSigningAccountName: 'value-of-AZURE_TRUSTED_SIGNING_ACCOUNT_NAME',
      certificateProfileName: 'value-of-AZURE_TRUSTED_SIGNING_CERTIFICATE_PROFILE',
      publisherName: 'value-of-AZURE_TRUSTED_SIGNING_PUBLISHER_NAME',
    })
    expect(summary.windowsSigning).toBe('azure-trusted-signing')
    expect(() => builderOverlay({ AZURE_TENANT_ID: 't' }, { version: '1.2.0' })).toThrow(/partly configured/)
  })

  it('merges into the yml config (objects merged, arrays replaced)', () => {
    const base = { win: { target: ['nsis'], icon: 'a' }, publish: [{ provider: 'github' }] }
    expect(mergeConfig(base, { win: { azureSignOptions: { x: 1 } }, publish: [{ provider: 'generic' }] })).toEqual({
      win: { target: ['nsis'], icon: 'a', azureSignOptions: { x: 1 } },
      publish: [{ provider: 'generic' }],
    })
  })
})

const makeFeed = async ({
  version = '1.3.0',
  channel = 'stable',
  platform = 'linux' as const,
  tamper = false,
} = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'stemn-feed-test-'))
  const name = `Stemn-${version}-linux-x86_64.AppImage`
  writeFileSync(join(dir, name), `installer ${version}`)
  const info = createUpdateInfo({
    version,
    files: [await fileEntry(join(dir, name), name)],
    releaseNotes: '- Notes',
    releaseDate: '2026-11-01T00:00:00.000Z',
  })
  writeFileSync(join(dir, channelFile(channel, platform)), stringifyUpdateInfo(info))
  if (tamper) writeFileSync(join(dir, name), 'something else')
  return { dir, name, info }
}

describe('update feed files', () => {
  it('names channel files like electron-builder', () => {
    expect(channelFile('stable', 'win')).toBe('latest.yml')
    expect(channelFile('stable', 'mac')).toBe('latest-mac.yml')
    expect(channelFile('beta', 'linux')).toBe('beta-linux.yml')
  })

  it('generates update info that round-trips through yml', async () => {
    const { info } = await makeFeed()
    const parsed = parseUpdateInfo(stringifyUpdateInfo(info))
    expect(parsed).toEqual(info)
    expect(parsed).toMatchObject({
      version: '1.3.0',
      path: 'Stemn-1.3.0-linux-x86_64.AppImage',
      releaseNotes: '- Notes',
    })
    expect(parsed.sha512).toBe(await sha512('installer 1.3.0'))
    expect(checkUpdateInfo(parsed)).toEqual([])
  })

  it('detects structural problems', () => {
    expect(checkUpdateInfo({ version: 'one', files: [] })).toEqual(['invalid version "one"', 'no files'])
    expect(
      checkUpdateInfo(
        { version: '1.0.0', files: [{ url: 'a', sha512: 'x', size: 0 }], path: 'b' },
        { expectedVersion: '1.1.0' },
      ),
    ).toEqual([
      'version is 1.0.0, expected 1.1.0',
      'files[0] has no valid sha512',
      'files[0] has no valid size',
      'path b is not files[0] (a)',
    ])
    expect(() => parseUpdateInfo('a: [', 'latest.yml')).toThrow(/latest.yml is not valid yaml/)
  })

  it('verifies a feed directory against its installers', async () => {
    const { dir } = await makeFeed()
    const result = await verifyFeed(dir, { channel: 'stable', require: ['linux'], expectedVersion: '1.3.0' })
    expect(result).toEqual({
      ok: true,
      problems: [],
      checked: [{ file: 'latest-linux.yml', version: '1.3.0', files: ['Stemn-1.3.0-linux-x86_64.AppImage'] }],
    })
  })

  it('fails on a sha512 mismatch, missing installers and missing platforms', async () => {
    const tampered = await makeFeed({ tamper: true })
    expect((await verifyFeed(tampered.dir, { channel: 'stable' })).problems).toEqual([
      'latest-linux.yml: Stemn-1.3.0-linux-x86_64.AppImage sha512 mismatch',
    ])
    const { dir } = await makeFeed({ channel: 'beta', version: '1.4.0-beta.1' })
    expect((await verifyFeed(dir, { channel: 'beta', require: ['win', 'linux'] })).problems).toEqual([
      'beta.yml: missing',
    ])
    expect((await verifyFeed(dir, { channel: 'stable' })).problems).toEqual([`no stable channel files in ${dir}`])
    writeFileSync(
      join(dir, 'beta-mac.yml'),
      stringifyUpdateInfo({
        ...parseUpdateInfo('version: 1.4.0-beta.1'),
        files: [{ url: 'Stemn.zip', sha512: 'A'.repeat(86) + '==', size: 3 }],
      }),
    )
    expect((await verifyFeed(dir, { channel: 'beta' })).problems).toEqual([
      'beta-mac.yml: Stemn.zip does not exist in the feed',
    ])
  })

  it('verifies a feed over http', async () => {
    const { dir, info, name } = await makeFeed()
    const { readFileSync } = await import('node:fs')
    const fetchImpl = async (url: string) => {
      const file = url.split('/').pop()!
      if (file === 'latest-linux.yml') return new Response(stringifyUpdateInfo(info))
      if (file === name) return new Response(readFileSync(join(dir, name)))
      return new Response('not found', { status: 404 })
    }
    const result = await verifyFeed('https://updates.example.eu/desktop/stable', {
      channel: 'stable',
      fetchImpl,
    } as any)
    expect(result.ok).toBe(true)
  })
})

describe('object-storage feed (rclone)', () => {
  it('orders versions like semver', () => {
    expect(sortVersions(['1.10.0', '1.2.0', '1.2.0-beta.10', '1.2.0-beta.2', '0.9.1'])).toEqual([
      '0.9.1',
      '1.2.0-beta.2',
      '1.2.0-beta.10',
      '1.2.0',
      '1.10.0',
    ])
    expect(compareVersions('1.2.0', '1.2.0')).toBe(0)
    expect(previousRelease(['1.0.0', '1.1.0', '1.2.0'], '1.2.0')).toBe('1.1.0')
    expect(previousRelease(['1.2.0'], '1.2.0')).toBe(null)
  })

  it('points a channel at an archived release (rollback / promote)', () => {
    const calls: any[] = []
    pointChannelAt('stemn-eu:updates/desktop/', 'stable', '1.1.0', {
      run: (args: string[], options: any) => calls.push({ args, options }),
    })
    expect(calls).toEqual([
      {
        args: [
          'copy',
          'stemn-eu:updates/desktop/stable/releases/1.1.0',
          'stemn-eu:updates/desktop/stable',
          '--include',
          '*.yml',
          '--no-traverse',
          '--header-upload',
          'Cache-Control: no-cache, max-age=0',
        ],
        options: { dryRun: false },
      },
    ])
  })

  it('reads the version a channel serves', () => {
    const run = (args: string[]) => {
      if (args[1].endsWith('stable/latest-linux.yml')) return 'version: 1.2.0\nfiles: []\n'
      throw new Error('not found')
    }
    expect(liveVersion('r:desktop', 'stable', { run })).toBe('1.2.0')
    expect(liveVersion('r:desktop', 'beta', { run })).toBe(null)
  })

  it('only uses the configured buckets', () => {
    expect(configuredBuckets({ UPDATES_BUCKET_EU: 'eu:b/desktop' })).toEqual({ eu: 'eu:b/desktop' })
    expect(configuredBuckets({ UPDATES_BUCKET_EU: 'eu:b', UPDATES_BUCKET_GLOBAL: 'g:b' }, 'global')).toEqual({
      global: 'g:b',
    })
  })
})
