/**
 * Update feed files (electron-updater "update info" yml: latest.yml, latest-mac.yml,
 * latest-linux.yml, beta*.yml): generation, parsing and verification.
 * Pure helpers + small fs/fetch readers; unit-tested in tests/unit/release.test.ts and used by
 * verify-feed.mjs, stage-feed.mjs and the updater integration test.
 */
import { createHash } from 'node:crypto'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { Readable } from 'node:stream'
import { dump as dumpYaml, load as loadYaml } from 'js-yaml'

export const PLATFORM_SUFFIX = { win: '', mac: '-mac', linux: '-linux' }
export const PLATFORMS = Object.keys(PLATFORM_SUFFIX)

/** Channel file name: channelFile('stable', 'mac') -> 'latest-mac.yml', channelFile('beta', 'win') -> 'beta.yml' */
export const channelFile = (channel, platform) => {
  if (!(platform in PLATFORM_SUFFIX)) throw new Error(`Unknown platform ${platform}`)
  return `${channel === 'beta' ? 'beta' : 'latest'}${PLATFORM_SUFFIX[platform]}.yml`
}

export const channelFiles = (channel) => PLATFORMS.map((platform) => channelFile(channel, platform))

const semverPattern = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/

/** SHA-512 (base64, the encoding of electron-builder's update info) of a stream, buffer or string */
export const sha512 = async (input) => {
  const hash = createHash('sha512')
  if (typeof input === 'string' || Buffer.isBuffer(input) || input instanceof Uint8Array) {
    hash.update(input)
  } else {
    for await (const chunk of input) hash.update(chunk)
  }
  return hash.digest('base64')
}

/** { url, sha512, size } of a local file, as listed in update info `files` */
export const fileEntry = async (path, url) => ({
  url,
  sha512: await sha512(createReadStream(path)),
  size: statSync(path).size,
})

/**
 * Update info in electron-builder's layout. `files[0]` is the installer electron-updater uses
 * (the legacy top-level path/sha512 repeat it).
 */
export const createUpdateInfo = ({ version, files, releaseNotes, releaseDate = new Date().toISOString() }) => {
  if (!semverPattern.test(version)) throw new Error(`Invalid version ${version}`)
  if (!files || files.length === 0) throw new Error('Update info needs at least one file')
  const info = {
    version,
    files: files.map(({ url, sha512: hash, size, blockMapSize }) => ({
      url,
      sha512: hash,
      size,
      ...(blockMapSize ? { blockMapSize } : {}),
    })),
    path: files[0].url,
    sha512: files[0].sha512,
    releaseDate,
  }
  if (releaseNotes) info.releaseNotes = releaseNotes
  return info
}

export const stringifyUpdateInfo = (info) => dumpYaml(info, { lineWidth: -1 })

export const parseUpdateInfo = (text, source = 'update info') => {
  let info
  try {
    info = loadYaml(text)
  } catch (error) {
    throw new Error(`${source} is not valid yaml: ${error.message}`, { cause: error })
  }
  if (!info || typeof info !== 'object') throw new Error(`${source} is empty`)
  return info
}

/** Structural problems of an update info object (no I/O) */
export const checkUpdateInfo = (info, { expectedVersion } = {}) => {
  const problems = []
  if (!info.version || !semverPattern.test(String(info.version))) problems.push(`invalid version "${info.version}"`)
  if (expectedVersion && info.version !== expectedVersion) {
    problems.push(`version is ${info.version}, expected ${expectedVersion}`)
  }
  if (!Array.isArray(info.files) || info.files.length === 0) {
    problems.push('no files')
    return problems
  }
  info.files.forEach((file, index) => {
    if (!file.url) problems.push(`files[${index}] has no url`)
    if (!file.sha512 || !/^[A-Za-z0-9+/]{86}==$/.test(file.sha512)) problems.push(`files[${index}] has no valid sha512`)
    if (!Number.isInteger(file.size) || file.size <= 0) problems.push(`files[${index}] has no valid size`)
  })
  if (info.path && info.path !== info.files[0].url)
    problems.push(`path ${info.path} is not files[0] (${info.files[0].url})`)
  if (info.sha512 && info.sha512 !== info.files[0].sha512) problems.push('sha512 differs from files[0]')
  return problems
}

const isUrl = (location) => /^https?:\/\//i.test(location)

/** Reader of a feed directory: a local path or an http(s) base url */
export const feedReader = (location, { fetchImpl = globalThis.fetch } = {}) => {
  if (isUrl(location)) {
    const base = location.endsWith('/') ? location : `${location}/`
    const resolve = (name) => new URL(name, base).href
    return {
      location: base,
      resolve,
      readText: async (name) => {
        const response = await fetchImpl(resolve(name), { cache: 'no-store' })
        if (response.status === 404) return null
        if (!response.ok) throw new Error(`GET ${resolve(name)}: HTTP ${response.status}`)
        return response.text()
      },
      /** { sha512, size } of a feed file, null if it does not exist */
      digest: async (name) => {
        const response = await fetchImpl(resolve(name))
        if (response.status === 404) return null
        if (!response.ok || !response.body) throw new Error(`GET ${resolve(name)}: HTTP ${response.status}`)
        let size = 0
        const hash = createHash('sha512')
        for await (const chunk of Readable.fromWeb(response.body)) {
          size += chunk.length
          hash.update(chunk)
        }
        return { sha512: hash.digest('base64'), size }
      },
    }
  }
  const resolve = (name) => join(location, decodeURIComponent(name))
  return {
    location,
    resolve,
    readText: async (name) => {
      const path = resolve(name)
      if (!existsSync(path)) return null
      const { readFile } = await import('node:fs/promises')
      return readFile(path, 'utf8')
    },
    digest: async (name) => {
      const path = resolve(name)
      if (!existsSync(path)) return null
      return { sha512: await sha512(createReadStream(path)), size: statSync(path).size }
    },
  }
}

/**
 * Verify the channel files of a feed directory: each one present must be valid and point at files
 * that exist with the advertised SHA-512 and size.
 *
 * @param {string} location local directory or https base url of one channel directory
 * @param {object} options
 * @param {'stable' | 'beta'} options.channel
 * @param {string[]} [options.require] platforms whose channel file must exist (e.g. ['win', 'mac', 'linux'])
 * @param {string} [options.expectedVersion]
 * @returns {Promise<{ ok: boolean, problems: string[], checked: { file: string, version: string, files: string[] }[] }>}
 */
export const verifyFeed = async (location, { channel, require = [], expectedVersion, fetchImpl } = {}) => {
  const reader = feedReader(location, { fetchImpl })
  const problems = []
  const checked = []
  for (const platform of PLATFORMS) {
    const name = channelFile(channel, platform)
    const text = await reader.readText(name)
    if (text === null) {
      if (require.includes(platform)) problems.push(`${name}: missing`)
      continue
    }
    let info
    try {
      info = parseUpdateInfo(text, name)
    } catch (error) {
      problems.push(error.message)
      continue
    }
    const structural = checkUpdateInfo(info, { expectedVersion })
    problems.push(...structural.map((problem) => `${name}: ${problem}`))
    if (!Array.isArray(info.files)) continue
    for (const file of info.files) {
      if (!file.url) continue
      const digest = await reader.digest(file.url)
      if (!digest) problems.push(`${name}: ${file.url} does not exist in the feed`)
      else if (digest.sha512 !== file.sha512) problems.push(`${name}: ${file.url} sha512 mismatch`)
      else if (digest.size !== file.size)
        problems.push(`${name}: ${file.url} size is ${digest.size}, expected ${file.size}`)
    }
    checked.push({ file: name, version: info.version, files: info.files.map((file) => file.url) })
  }
  if (checked.length === 0 && problems.length === 0) problems.push(`no ${channel} channel files in ${reader.location}`)
  return { ok: problems.length === 0, problems, checked }
}
