/**
 * Where each edition of Stemn Desktop looks for updates.
 *
 * Used at build time by electron.vite.config.ts (GLOBAL_ENV.UPDATE_FEED, read by the
 * main-process updater) and electron-builder.config.mjs (the `publish` config that
 * electron-builder writes into the app as app-update.yml), so both always agree.
 *
 *   STEMN_EDITION=global (default)
 *     UPDATES_URL set   -> generic HTTPS feed at $UPDATES_URL/<channel>/
 *     otherwise         -> GitHub releases of stemn/stemn-desktop (until updates.stemn.com exists)
 *   STEMN_EDITION=eu
 *     generic HTTPS feed at ${UPDATES_URL:-https://updates.stemn.eu/desktop}/<channel>/ (never GitHub)
 *
 * Channels: `stable` (channel file latest*.yml) and `beta` (beta*.yml). A feed directory per
 * channel: <base>/stable/latest.yml, <base>/stable/latest-mac.yml, <base>/stable/latest-linux.yml,
 * <base>/beta/beta.yml, ... next to the installers they point at.
 */
const GITHUB_RELEASES = { owner: 'stemn', repo: 'stemn-desktop' }

const EDITIONS = {
  global: { defaultUrl: null, github: GITHUB_RELEASES },
  eu: { defaultUrl: 'https://updates.stemn.eu/desktop', github: null },
}

const CHANNELS = ['stable', 'beta']

/** electron-updater channel file name (without the -mac / -linux suffix) for a Stemn channel */
const channelFileName = (channel) => (channel === 'beta' ? 'beta' : 'latest')

/** Pre-release versions (1.2.0-beta.3) belong to the beta channel */
const channelForVersion = (version) => (/^\d+\.\d+\.\d+-/.test(String(version || '')) ? 'beta' : 'stable')

const isLocalhost = (hostname) => ['localhost', '127.0.0.1', '[::1]', '::1'].includes(hostname)

/** Feed base urls must be https (http is only accepted for localhost, e.g. the updater tests) */
const normaliseBaseUrl = (url) => {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    throw new Error(`Invalid update feed url: ${url}`)
  }
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && isLocalhost(parsed.hostname))) {
    throw new Error(`The update feed must be served over https: ${url}`)
  }
  return parsed.href.replace(/\/+$/, '')
}

/**
 * @param {Record<string, string | undefined>} env
 * @returns {{ edition: 'global' | 'eu', provider: 'generic', url: string } |
 *           { edition: 'global' | 'eu', provider: 'github', owner: string, repo: string }}
 */
const resolveUpdateFeed = (env = process.env) => {
  const edition = env.STEMN_EDITION || 'global'
  const definition = EDITIONS[edition]
  if (!definition) {
    throw new Error(`Unknown STEMN_EDITION "${edition}". Use one of ${Object.keys(EDITIONS).join(', ')}.`)
  }
  const url = env.UPDATES_URL || definition.defaultUrl
  if (url) return { edition, provider: 'generic', url: normaliseBaseUrl(url) }
  return { edition, provider: 'github', ...definition.github }
}

/** The feed directory of a channel on a generic feed: <base>/<channel>/ */
const feedUrlForChannel = (baseUrl, channel) => `${normaliseBaseUrl(baseUrl)}/${channel}/`

/** electron-builder `publish` entries for a build of `channel` (written into app-update.yml) */
const builderPublishConfig = (feed, channel) => {
  if (feed.provider === 'generic') {
    return [{ provider: 'generic', url: feedUrlForChannel(feed.url, channel), channel: channelFileName(channel) }]
  }
  return [{ provider: 'github', owner: feed.owner, repo: feed.repo }]
}

module.exports = {
  CHANNELS,
  EDITIONS,
  GITHUB_RELEASES,
  builderPublishConfig,
  channelFileName,
  channelForVersion,
  feedUrlForChannel,
  normaliseBaseUrl,
  resolveUpdateFeed,
}
