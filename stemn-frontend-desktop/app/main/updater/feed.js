/**
 * Channel selection and electron-updater feed options (pure: no Electron imports, unit-tested in
 * tests/unit/updater.test.ts).
 */
import { CHANNELS, channelFileName, channelForVersion, feedUrlForChannel } from '../../../config/updateFeed.cjs'

export { CHANNELS, channelForVersion }

/**
 * The channel the app should follow: the user's setting, or the channel of the running version
 * when the setting was never changed (a beta build follows beta until the user picks stable).
 */
export const selectChannel = ({ setting, currentVersion }) =>
  CHANNELS.includes(setting) ? setting : channelForVersion(currentVersion)

/**
 * electron-updater options for `autoUpdater.setFeedURL()`.
 *
 * @param {object} options
 * @param {{ provider: 'generic', url: string } | { provider: 'github', owner: string, repo: string }} options.feed
 *   the build-time feed of this edition (GLOBAL_ENV.UPDATE_FEED)
 * @param {'stable' | 'beta'} options.channel
 * @param {string} [options.overrideUrl] STEMN_UPDATES_URL: a generic feed base url to use instead
 *   (local feeds for tests and QA)
 */
export const feedOptions = ({ feed, channel, overrideUrl }) => {
  if (overrideUrl) {
    return { provider: 'generic', url: feedUrlForChannel(overrideUrl, channel), channel: channelFileName(channel) }
  }
  if (feed.provider === 'generic') {
    return { provider: 'generic', url: feedUrlForChannel(feed.url, channel), channel: channelFileName(channel) }
  }
  // GitHub releases: beta builds are published as pre-releases (picked up with allowPrerelease)
  return { provider: 'github', owner: feed.owner, repo: feed.repo }
}

/**
 * Updater flags for a channel. Stable downloads in the background; beta asks first.
 * Downgrades are never automatic (switching from beta back to stable waits for the next stable
 * version; a pulled release is replaced by a newer one, see RELEASING.md).
 */
export const channelPolicy = (channel) => ({
  autoDownload: channel === 'stable',
  allowPrerelease: channel === 'beta',
  allowDowngrade: false,
  autoInstallOnAppQuit: true,
})

/** electron-updater's releaseNotes is a string (generic/yml) or [{ version, note }] (GitHub, full changelog) */
export const releaseNotesText = (releaseNotes) => {
  if (!releaseNotes) return ''
  if (typeof releaseNotes === 'string') return releaseNotes
  if (Array.isArray(releaseNotes)) {
    return releaseNotes
      .filter((entry) => entry && entry.note)
      .map((entry) => (entry.version ? `## ${entry.version}\n\n${entry.note}` : entry.note))
      .join('\n\n')
  }
  return ''
}
