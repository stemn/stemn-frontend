#!/usr/bin/env node
/**
 * Pull a bad release: the feed goes back to serving the previous version's channel files.
 *
 *   node scripts/release/rollback.mjs <bad version> [--to <version>] [--edition global|eu|all]
 *        [--github] [--dry-run]
 *
 *  - object storage (UPDATES_BUCKET_GLOBAL / UPDATES_BUCKET_EU): copies
 *    <channel>/releases/<to>/*.yml over the live channel files (default --to: the newest archived
 *    release older than the bad one); the beta channel is rolled back too if it serves the bad version
 *  - --github: turns the release v<bad> of stemn/stemn-desktop back into a draft, so apps that use
 *    the GitHub provider (global edition before updates.stemn.com exists) see the previous release
 *    as the latest one (needs GH_TOKEN with access to stemn/stemn-desktop)
 *
 * Installed apps never downgrade on their own: users who already installed the bad version stay on
 * it until a newer version is published (or reinstall the previous one from the link in the release
 * notes). The usual fix is a new patch release; rollback stops the bad version from spreading.
 */
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { fail, parseArgs } from './lib/cli.mjs'
import { configuredBuckets, listReleases, liveVersion, pointChannelAt, previousRelease } from './lib/rclone.mjs'

const require = createRequire(import.meta.url)
const { GITHUB_RELEASES, channelForVersion } = require('../../config/updateFeed.cjs')

const { positional, options } = parseArgs(process.argv.slice(2), { booleans: ['dry-run', 'github'] })
const [bad] = positional
if (!bad) fail('usage: rollback.mjs <bad version> [--to <version>] [--edition global|eu|all] [--github] [--dry-run]')
const dryRun = !!options['dry-run']
const channel = channelForVersion(bad)
const buckets = configuredBuckets(process.env, options.edition || 'all')

if (Object.keys(buckets).length === 0 && !options.github) {
  fail('nothing to roll back: set UPDATES_BUCKET_GLOBAL / UPDATES_BUCKET_EU and/or pass --github')
}

for (const [edition, root] of Object.entries(buckets)) {
  const to = options.to || previousRelease(listReleases(root, channel), bad)
  if (!to) fail(`${edition}: no release older than ${bad} under ${root}/${channel}/releases (pass --to)`)
  const live = liveVersion(root, channel)
  console.log(`\n== ${edition}: ${channel} serves ${live || 'nothing'}; rolling back ${bad} -> ${to}`)
  if (live && live !== bad) console.warn(`warning: the ${channel} channel serves ${live}, not ${bad}`)
  pointChannelAt(root, channel, to, { dryRun })
  if (channel === 'stable' && liveVersion(root, 'beta') === bad) {
    if (listReleases(root, 'beta').includes(to)) {
      console.log(`beta channel also served ${bad}: rolling it back to ${to}`)
      pointChannelAt(root, 'beta', to, { dryRun })
    } else {
      console.warn(
        `warning: the beta channel serves ${bad} but ${root}/beta/releases/${to} does not exist: ` +
          `roll it back to an archived beta with: rollback.mjs ${bad} --to <version> (beta versions: ${listReleases(root, 'beta').join(', ') || 'none'})`,
      )
    }
  }
}

if (options.github) {
  const repo = `${GITHUB_RELEASES.owner}/${GITHUB_RELEASES.repo}`
  const args = ['release', 'edit', `v${bad}`, '--repo', repo, '--draft=true']
  console.log(`\n$ gh ${args.join(' ')}${dryRun ? '   (dry run)' : ''}`)
  if (!dryRun) execFileSync('gh', args, { stdio: 'inherit' })
}

console.log(`
Done. ${bad} is no longer offered as an update${dryRun ? ' (dry run: nothing changed)' : ''}.
Users who already installed ${bad} keep it until a newer version is published: ship the fix as a new
version (scripts/release/prepare.mjs patch), and say in its release notes how to reinstall if needed.`)
