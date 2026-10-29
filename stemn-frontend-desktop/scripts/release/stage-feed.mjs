#!/usr/bin/env node
/**
 * CI glue for the publish job of desktop-release.yml: verifies the build artefacts and lays them
 * out for the GitHub release and for the object-storage feeds.
 *
 *   node scripts/release/stage-feed.mjs --artifacts <dir> --out <dir>
 *
 * <artifacts>/<any>/release.json ({ version, channel, edition, os }, written by the build job) next
 * to that build's installers, .blockmap files and channel files. Output:
 *
 *   <out>/github/                      global edition: installers + channel files + SHA256SUMS
 *   <out>/feed/<edition>/<channel>/    installers + releases/<version>/<channel files>
 *                                      (stable releases are also staged under beta/, so the beta
 *                                      channel can follow a newer stable version)
 *
 * The live channel files are not written here: promote.mjs copies releases/<version>/ over them
 * when the release is published.
 */
import { createHash } from 'node:crypto'
import { copyFileSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { basename, join } from 'node:path'
import { fail, parseArgs } from './lib/cli.mjs'
import { verifyFeed } from './lib/feed.mjs'

const { options } = parseArgs(process.argv.slice(2))
if (!options.artifacts || !options.out) fail('usage: stage-feed.mjs --artifacts <dir> --out <dir>')

const OS_PLATFORM = { linux: 'linux', macos: 'mac', windows: 'win' }
const isChannelFile = (name) => /^(latest|beta|alpha)(-mac|-linux(-[a-z0-9]+)?)?\.yml$/.test(name)

const builds = readdirSync(options.artifacts)
  .map((name) => join(options.artifacts, name))
  .filter((dir) => statSync(dir).isDirectory())
  .map((dir) => ({ dir, ...JSON.parse(readFileSync(join(dir, 'release.json'), 'utf8')) }))
if (builds.length === 0) fail(`no builds (release.json) in ${options.artifacts}`)

const versions = new Set(builds.map((build) => build.version))
if (versions.size !== 1) fail(`the builds have different versions: ${[...versions].join(', ')}`)
const [version] = versions

const problems = []
const copy = (from, toDir) => {
  mkdirSync(toDir, { recursive: true })
  copyFileSync(from, join(toDir, basename(from)))
}

for (const build of builds) {
  const platform = OS_PLATFORM[build.os]
  if (!platform) fail(`unknown os ${build.os} in ${build.dir}`)
  const result = await verifyFeed(build.dir, { channel: build.channel, require: [platform], expectedVersion: version })
  problems.push(...result.problems.map((problem) => `${build.os}/${build.edition}: ${problem}`))
  const files = readdirSync(build.dir).filter((name) => name !== 'release.json')
  const channelFiles = files.filter(isChannelFile)
  const payload = files.filter((name) => !isChannelFile(name))
  const channels = build.channel === 'stable' ? ['stable', 'beta'] : ['beta']

  for (const channel of channels) {
    const channelDir = join(options.out, 'feed', build.edition, channel)
    const prefix = channel === 'beta' ? 'beta' : 'latest'
    payload.forEach((name) => copy(join(build.dir, name), channelDir))
    channelFiles
      .filter((name) => name.startsWith(prefix))
      .forEach((name) => copy(join(build.dir, name), join(channelDir, 'releases', version)))
  }
  if (build.edition === 'global') {
    files
      .filter((name) => !name.startsWith('alpha'))
      .forEach((name) => copy(join(build.dir, name), join(options.out, 'github')))
  }
  console.log(
    `staged ${build.os}/${build.edition} ${build.channel}: ${payload.join(', ')} + ${channelFiles.join(', ')}`,
  )
}

if (problems.length > 0) {
  problems.forEach((problem) => console.error(`FAIL ${problem}`))
  process.exit(1)
}

const githubDir = join(options.out, 'github')
try {
  const sums = readdirSync(githubDir)
    .filter((name) => !name.endsWith('.yml') && !name.endsWith('.blockmap'))
    .sort()
    .map(
      (name) =>
        `${createHash('sha256')
          .update(readFileSync(join(githubDir, name)))
          .digest('hex')}  ${name}`,
    )
  writeFileSync(join(githubDir, 'SHA256SUMS'), `${sums.join('\n')}\n`)
} catch {
  // no global edition build
}
writeFileSync(join(options.out, 'version'), version)
console.log(`staged ${version} into ${options.out}`)
