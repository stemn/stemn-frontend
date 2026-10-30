/**
 * The object-storage side of the generic feed, through rclone (any S3-compatible / EU provider).
 *
 * Bucket layout under a feed root (UPDATES_BUCKET_GLOBAL / UPDATES_BUCKET_EU, an rclone path such as
 * `stemn-eu:updates-stemn-eu/desktop`):
 *
 *   <channel>/<installers, .blockmap files>       uploaded by the publish job (draft release)
 *   <channel>/releases/<version>/*.yml            the channel files of every release (archive)
 *   <channel>/latest*.yml | beta*.yml             what installed apps poll: copied from releases/<version>/
 *                                                 when the release is published ("promote") or rolled back
 */
import { execFileSync } from 'node:child_process'

export const rclone = (args, { dryRun = false, capture = false } = {}) => {
  const command = ['rclone', ...args, ...(dryRun ? ['--dry-run'] : [])]
  console.log(`$ ${command.join(' ')}`)
  return execFileSync(command[0], command.slice(1), {
    encoding: 'utf8',
    // captured calls are probes (lsf, cat): a missing path is an expected answer, not an error to print
    stdio: capture ? ['ignore', 'pipe', 'ignore'] : 'inherit',
  })
}

const join = (...parts) =>
  parts.map((part, index) => (index === 0 ? part.replace(/\/+$/, '') : part.replace(/^\/+|\/+$/g, ''))).join('/')

export const channelPath = (root, channel) => join(root, channel)
export const releasePath = (root, channel, version) => join(root, channel, 'releases', version)

/** Versions archived under <channel>/releases/, oldest first (semver order) */
export const listReleases = (root, channel, { run = rclone } = {}) => {
  let output
  try {
    output = run(['lsf', '--dirs-only', join(root, channel, 'releases')], { capture: true }) || ''
  } catch {
    return []
  }
  return sortVersions(
    output
      .split('\n')
      .map((line) => line.trim().replace(/\/$/, ''))
      .filter(Boolean),
  )
}

const parseVersion = (version) => {
  const [core, pre = ''] = version.split('-')
  return { parts: core.split('.').map(Number), pre }
}

/** semver sort (pre-releases before their release; numeric pre-release identifiers compared as numbers) */
export const compareVersions = (a, b) => {
  const left = parseVersion(a)
  const right = parseVersion(b)
  for (let index = 0; index < 3; index++) {
    if (left.parts[index] !== right.parts[index]) return left.parts[index] - right.parts[index]
  }
  if (left.pre === right.pre) return 0
  if (!left.pre) return 1
  if (!right.pre) return -1
  const leftIds = left.pre.split('.')
  const rightIds = right.pre.split('.')
  for (let index = 0; index < Math.max(leftIds.length, rightIds.length); index++) {
    const x = leftIds[index]
    const y = rightIds[index]
    if (x === undefined) return -1
    if (y === undefined) return 1
    const numeric = /^\d+$/.test(x) && /^\d+$/.test(y)
    if (x !== y) return numeric ? Number(x) - Number(y) : x < y ? -1 : 1
  }
  return 0
}

export const sortVersions = (versions) => [...versions].sort(compareVersions)

/** The release before `version` in a sorted list (for rollbacks), or null */
export const previousRelease = (versions, version) => {
  const older = sortVersions(versions).filter((candidate) => compareVersions(candidate, version) < 0)
  return older.length > 0 ? older[older.length - 1] : null
}

/** Make <channel>/ serve `version`: copy its archived channel files over the live ones */
export const pointChannelAt = (root, channel, version, { dryRun = false, run = rclone } = {}) => {
  run(
    [
      'copy',
      releasePath(root, channel, version),
      channelPath(root, channel),
      '--include',
      '*.yml',
      '--no-traverse',
      // the channel files must not be cached by a CDN in front of the bucket
      '--header-upload',
      'Cache-Control: no-cache, max-age=0',
    ],
    { dryRun },
  )
}

/** Version served by <channel>/ right now (from its linux, mac or windows channel file), or null */
export const liveVersion = (root, channel, { run = rclone } = {}) => {
  const prefix = channel === 'beta' ? 'beta' : 'latest'
  for (const name of [`${prefix}-linux.yml`, `${prefix}-mac.yml`, `${prefix}.yml`]) {
    try {
      const text = run(['cat', join(channelPath(root, channel), name)], { capture: true })
      const match = /^version:\s*['"]?([^'"\s]+)/m.exec(text || '')
      if (match) return match[1]
    } catch {
      // not there
    }
  }
  return null
}

/** Bucket roots configured in the environment: { global: 'remote:path', eu: 'remote:path' } */
export const configuredBuckets = (env, edition = 'all') =>
  Object.fromEntries(
    [
      ['global', env.UPDATES_BUCKET_GLOBAL],
      ['eu', env.UPDATES_BUCKET_EU],
    ].filter(([name, root]) => root && (edition === 'all' || edition === name)),
  )
