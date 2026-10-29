#!/usr/bin/env node
/**
 * Verify an update feed: every channel file (latest.yml, latest-mac.yml, latest-linux.yml or the
 * beta*.yml ones) must be valid and point at installers that exist with the advertised SHA-512
 * and size.
 *
 *   node scripts/release/verify-feed.mjs <channel dir or https url> [--channel stable|beta]
 *        [--require win,mac,linux] [--version X.Y.Z]
 *
 *   node scripts/release/verify-feed.mjs https://updates.stemn.eu/desktop/stable --require win,mac,linux
 *   node scripts/release/verify-feed.mjs feed/global/stable --version 1.2.0
 */
import { fail, parseArgs } from './lib/cli.mjs'
import { verifyFeed } from './lib/feed.mjs'

const { positional, options } = parseArgs(process.argv.slice(2))
const [location] = positional
if (!location) fail('usage: verify-feed.mjs <dir|url> [--channel stable|beta] [--require win,mac,linux] [--version X]')

const channel = options.channel || (/\/beta\/?$/.test(location) ? 'beta' : 'stable')
const required = typeof options.require === 'string' ? options.require.split(',').filter(Boolean) : []

const result = await verifyFeed(location, { channel, require: required, expectedVersion: options.version })
for (const entry of result.checked) {
  console.log(`ok   ${entry.file}: ${entry.version} -> ${entry.files.join(', ')}`)
}
for (const problem of result.problems) console.error(`FAIL ${problem}`)
if (!result.ok) process.exit(1)
console.log(`${location}: ${channel} feed verified (${result.checked.length} channel files)`)
