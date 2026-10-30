/**
 * Auto update (tauri-plugin-updater) against a local feed, with Tauri's minisign signatures.
 * Not one of the 11 Electron scenarios: it covers what the Electron suite can't run without a
 * packaged app (docs/plans/desktop-auto-update-and-signing.md, "Tests").
 *
 * A throwaway key pair signs a dummy artefact; the app is pointed at the feed
 * (STEMN_UPDATES_URL) and the test key (STEMN_UPDATES_PUBKEY, e2e builds only). The core store
 * must go update-available -> update-downloaded and the main window must ask to install;
 * a feed whose signature does not match must end in an update error instead. Installing is not
 * exercised (it replaces the running AppImage).
 */
import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { createServer, type Server } from 'node:http'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { byText, getState, launchApp, screenshot, tauriRoot } from './helpers'

const VERSION = '99.0.0'

const feedPlatform = () => {
  const os = { linux: 'linux', win32: 'windows', darwin: 'darwin' }[process.platform as string]
  const arch = { x64: 'x86_64', arm64: 'aarch64' }[process.arch as string]
  return `${os}-${arch}`
}

const serve = (files: Record<string, Buffer | string>) =>
  new Promise<{ server: Server; url: string }>((resolve) => {
    const server = createServer((request, response) => {
      const body = files[(request.url || '').split('?')[0]]
      if (body === undefined) {
        response.statusCode = 404
        response.end()
      } else {
        response.end(body)
      }
    })
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as { port: number }
      resolve({ server, url: `http://127.0.0.1:${port}` })
    })
  })

test.describe.serial('Stemn Desktop (Tauri) auto update', () => {
  const dir = mkdtempSync(join(tmpdir(), 'stemn-tauri-update-'))
  const keyFile = join(dir, 'updater.key')
  const artefact = join(dir, `Stemn_${VERSION}_amd64.AppImage`)
  let pubkey: string
  let signature: string

  test.beforeAll(() => {
    const tauri = (...args: string[]) => execFileSync('npx', ['tauri', ...args], { cwd: tauriRoot, stdio: 'pipe' })
    tauri('signer', 'generate', '--ci', '-p', '', '-w', keyFile)
    pubkey = readFileSync(`${keyFile}.pub`, 'utf8').trim()
    writeFileSync(artefact, Buffer.alloc(64 * 1024, 7))
    tauri('signer', 'sign', '-f', keyFile, '-p', '', artefact)
    signature = readFileSync(`${artefact}.sig`, 'utf8').trim()
  })

  const runWithFeed = async (sig: string, check: (app: Awaited<ReturnType<typeof launchApp>>) => Promise<void>) => {
    const files: Record<string, Buffer | string> = { '/Stemn.AppImage': readFileSync(artefact) }
    const { server, url } = await serve(files)
    files['/latest.json'] = JSON.stringify({
      version: VERSION,
      notes: 'Test release from the e2e feed',
      pub_date: new Date().toISOString(),
      platforms: { [feedPlatform()]: { signature: sig, url: `${url}/Stemn.AppImage` } },
    })
    const app = await launchApp({
      userDataDir: mkdtempSync(join(tmpdir(), 'stemn-tauri-update-profile-')),
      env: { STEMN_UPDATES_URL: `${url}/latest.json`, STEMN_UPDATES_PUBKEY: pubkey },
    })
    try {
      await check(app)
    } finally {
      await app.close()
      server.close()
    }
  }

  test('downloads a signed update from the feed and asks to install it', async () => {
    await runWithFeed(signature, async (app) => {
      const main = await app.win('main')
      // AutoUpdate.init runs 5 s after start
      await expect
        .poll(async () => (await getState(main)).autoUpdate, { timeout: 60_000 })
        .toMatchObject({ updateAvailable: true, updateDownloaded: true, release: { version: VERSION } })
      expect((await getState(main)).autoUpdate.release.readme).toBe('Test release from the e2e feed')
      await byText(main, 'Install update')
      await screenshot(main, '11-update-downloaded')
      expect(app.mainLog().some((line) => line.includes(`Update downloaded: ${VERSION}`))).toBe(true)
    })
  })

  test('rejects an update whose signature does not match', async () => {
    // a signature of other bytes, by the same key
    const other = join(dir, 'other.bin')
    writeFileSync(other, 'not the artefact')
    execFileSync('npx', ['tauri', 'signer', 'sign', '-f', keyFile, '-p', '', other], { cwd: tauriRoot, stdio: 'pipe' })
    const wrongSignature = readFileSync(`${other}.sig`, 'utf8').trim()
    await runWithFeed(wrongSignature, async (app) => {
      const main = await app.win('main')
      await expect
        .poll(async () => (await getState(main)).autoUpdate.updateError, { timeout: 60_000 })
        .toMatch(/signature/i)
      expect((await getState(main)).autoUpdate.updateDownloaded).toBe(false)
    })
  })
})
