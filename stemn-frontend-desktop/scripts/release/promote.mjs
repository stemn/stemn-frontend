#!/usr/bin/env node
/**
 * Switch the object-storage feed(s) to a staged release (run when the draft release is published):
 * copies <channel>/releases/<version>/*.yml over the live channel files. A stable release also
 * becomes the beta channel's version unless beta already serves something newer.
 *
 *   node scripts/release/promote.mjs <version> [--edition global|eu|all] [--dry-run]
 *
 * Buckets: UPDATES_BUCKET_GLOBAL / UPDATES_BUCKET_EU (rclone paths; rclone configured through
 * RCLONE_CONFIG_* variables or RCLONE_CONFIG). After switching, the public feed is verified when
 * UPDATES_URL_GLOBAL / UPDATES_URL_EU are set.
 */
import { createRequire } from 'node:module'
import { fail, parseArgs } from './lib/cli.mjs'
import { verifyFeed } from './lib/feed.mjs'
import { compareVersions, configuredBuckets, liveVersion, pointChannelAt } from './lib/rclone.mjs'

const require = createRequire(import.meta.url)
const { channelForVersion, feedUrlForChannel } = require('../../config/updateFeed.cjs')

const { positional, options } = parseArgs(process.argv.slice(2), { booleans: ['dry-run'] })
const [version] = positional
if (!version) fail('usage: promote.mjs <version> [--edition global|eu|all] [--dry-run]')
const dryRun = !!options['dry-run']
const channel = channelForVersion(version)
const buckets = configuredBuckets(process.env, options.edition || 'all')
if (Object.keys(buckets).length === 0) {
  console.log('No UPDATES_BUCKET_GLOBAL / UPDATES_BUCKET_EU configured: nothing to promote')
  process.exit(0)
}

const publicUrls = { global: process.env.UPDATES_URL_GLOBAL, eu: process.env.UPDATES_URL_EU }
let failed = false
for (const [edition, root] of Object.entries(buckets)) {
  console.log(`\n== ${edition}: ${channel} -> ${version}`)
  pointChannelAt(root, channel, version, { dryRun })
  const channels = [channel]
  if (channel === 'stable') {
    const beta = liveVersion(root, 'beta')
    if (!beta || compareVersions(beta, version) < 0) {
      console.log(`beta channel (${beta || 'empty'}) follows the stable release`)
      pointChannelAt(root, 'beta', version, { dryRun })
      channels.push('beta')
    } else {
      console.log(`beta channel keeps ${beta} (newer than ${version})`)
    }
  }
  if (publicUrls[edition] && !dryRun) {
    for (const promoted of channels) {
      const url = feedUrlForChannel(publicUrls[edition], promoted)
      const result = await verifyFeed(url, { channel: promoted, expectedVersion: version })
      result.problems.forEach((problem) => console.error(`FAIL ${url}: ${problem}`))
      if (result.ok) console.log(`verified ${url}`)
      else failed = true
    }
  }
}
if (failed) process.exit(1)
