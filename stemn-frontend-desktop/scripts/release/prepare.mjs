#!/usr/bin/env node
/**
 * Prepare a Stemn Desktop release: bump the version and write its CHANGELOG.md entry.
 *
 *   node scripts/release/prepare.mjs <patch|minor|major|beta|X.Y.Z[-beta.N]> [--since <git ref>] [--dry-run]
 *
 *  - bumps the version in stemn-frontend-desktop/package.json and in its package-lock.json entry
 *    (the two places the desktop version lives; the root package.json is the website's)
 *  - adds a CHANGELOG.md entry from the titles of the pull requests merged since the previous
 *    `desktop-v*` tag (or --since) that touched the desktop or the shared code
 *  - prints the commands to commit, tag (`desktop-v<version>`) and push. Nothing is committed or pushed.
 */
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { prependRelease } from '../../config/changelog.mjs'
import { fail, parseArgs } from './lib/cli.mjs'
import { bumpVersion, notesFromGitLog } from './lib/prepare.mjs'

const desktopRoot = join(dirname(fileURLToPath(import.meta.url)), '../..')
const repoRoot = join(desktopRoot, '..')
const { positional, options } = parseArgs(process.argv.slice(2), { booleans: ['dry-run'] })
const [kind] = positional
if (!kind) fail('usage: prepare.mjs <patch|minor|major|beta|X.Y.Z[-beta.N]> [--since <ref>] [--dry-run]')

const git = (...args) =>
  execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()

const packagePath = join(desktopRoot, 'package.json')
const lockPath = join(repoRoot, 'package-lock.json')
const changelogPath = join(desktopRoot, 'CHANGELOG.md')

const pkg = JSON.parse(readFileSync(packagePath, 'utf8'))
const current = pkg.version
let next
try {
  next = bumpVersion(current, kind)
} catch (error) {
  fail(error.message)
}

let since = options.since
if (!since) {
  try {
    since = git('describe', '--tags', '--match', 'desktop-v*', '--abbrev=0')
  } catch {
    since = null
  }
}
const range = since ? [`${since}..HEAD`] : ['-n', '50', 'HEAD']
const log = git(
  'log',
  '--first-parent',
  '--format=%s%x1f%b%x1e',
  ...range,
  '--',
  'stemn-frontend-desktop',
  'stemn-frontend-shared',
)
const notes = notesFromGitLog(log) || '- Maintenance release.'
const date = new Date().toISOString().slice(0, 10)

console.log(`Stemn Desktop ${current} -> ${next} (changes since ${since || 'the last 50 commits'})\n`)
console.log(`## ${next} (${date})\n\n${notes}\n`)

if (options['dry-run']) {
  console.log('--dry-run: nothing written')
  process.exit(0)
}

pkg.version = next
writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`)

const lock = JSON.parse(readFileSync(lockPath, 'utf8'))
if (lock.packages && lock.packages['stemn-frontend-desktop']) {
  lock.packages['stemn-frontend-desktop'].version = next
  writeFileSync(lockPath, `${JSON.stringify(lock, null, 2)}\n`)
}

writeFileSync(changelogPath, prependRelease(readFileSync(changelogPath, 'utf8'), { version: next, date, notes }))

console.log(`Updated stemn-frontend-desktop/package.json, package-lock.json and stemn-frontend-desktop/CHANGELOG.md.

Next:
  1. Edit the CHANGELOG.md entry (it becomes the in-app release notes and the feed's releaseNotes).
  2. git commit -am "chore(desktop): release ${next}" and merge it to staging through a pull request.
  3. On the merged commit: git tag desktop-v${next} && git push origin desktop-v${next}
     (desktop-release.yml builds, signs and creates a draft release in stemn/stemn-desktop).
  4. Review the draft and publish it: the feed switches to ${next}.`)
