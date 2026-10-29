/* Main process only */
import electronUpdater from 'electron-updater'
import log from 'electron-log/main'
import { version } from 'package-json'

import {
  currentVersion,
  checkForUpdates,
  updateAvailable,
  updateDownloaded,
  updateError,
  updateNotAvailable,
} from './AutoUpdate.actions.js'

/**
 * Auto update through electron-updater. The update feed is the `publish`
 * provider in electron-builder.yml (GitHub releases of Stemn/Stemn-Desktop);
 * electron-builder writes it into the packaged app as app-update.yml.
 */
export default function (store) {
  const { autoUpdater } = electronUpdater
  autoUpdater.logger = log
  autoUpdater.autoDownload = true

  log.info('Current version:', version)
  store.dispatch(currentVersion({ version }))

  autoUpdater.on('update-available', () => {
    store.dispatch(updateAvailable())
  })
  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info.version)
    store.dispatch(updateDownloaded({
      version: info.version,
      platform: process.platform,
      readme: typeof info.releaseNotes === 'string' ? info.releaseNotes : '',
    }))
  })
  autoUpdater.on('error', (error) => {
    log.info('Update Error:', error && error.message)
    setTimeout(() => store.dispatch(updateError(error)), 1)
  })
  autoUpdater.on('update-not-available', () => {
    store.dispatch(updateNotAvailable())
  })

  // If autoUpdate is true, we check for updates
  if (store.getState().system.settings.autoUpdate) {
    store.dispatch(checkForUpdates())
  }
}
