/**
 * Electron wiring of the auto-updater (see core.js for the policy).
 *
 * Feed: GLOBAL_ENV.UPDATE_FEED (baked in at build time from STEMN_EDITION / UPDATES_URL, see
 * config/updateFeed.cjs); STEMN_UPDATES_URL overrides it at runtime with a generic feed base url
 * (used by tests/updater and for QA against a staging feed).
 */
import { app } from 'electron'
import electronUpdater from 'electron-updater'
import log from 'electron-log/main'
import { setImplementation } from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.utils.js'
import { createUpdater } from './core.js'

/** One structured log line per updater event: `[updater] {"event":"update-available","version":"1.2.0"}` */
export const logEvent = (event, fields = {}) => {
  const line = `[updater] ${JSON.stringify({ event, ...fields })}`
  if (event === 'error') log.warn(line)
  else log.info(line)
}

/**
 * Only installed copies can update themselves: packaged builds, and on Linux only the AppImage
 * (the .deb is updated by reinstalling it, like any other package).
 */
const isSupported = () => {
  if (!app.isPackaged) return { supported: false, reason: 'not-packaged' }
  if (process.platform === 'linux' && !process.env.APPIMAGE) return { supported: false, reason: 'not-appimage' }
  return { supported: true }
}

let updater = null

export const getUpdater = () => updater

export const initUpdater = (store) => {
  if (updater) return updater
  const { autoUpdater } = electronUpdater
  // electron-updater's own (plain text) messages go to the same log
  autoUpdater.logger = log
  updater = createUpdater({
    autoUpdater,
    store,
    feed: GLOBAL_ENV.UPDATE_FEED,
    currentVersion: app.getVersion(),
    platform: process.platform,
    isSupported,
    overrideUrl: process.env.STEMN_UPDATES_URL || undefined,
    logEvent,
  })
  setImplementation(updater.functions)
  updater.start()
  return updater
}
