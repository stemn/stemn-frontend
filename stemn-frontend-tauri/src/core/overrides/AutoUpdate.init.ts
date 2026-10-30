/** Replaces stemn-shared/desktop/AutoUpdate/AutoUpdate.init.js: same actions, Tauri updater events */
import log from 'electron-log/main'
import { version } from 'package-json'
import {
  checkForUpdates,
  currentVersion,
  updateAvailable,
  updateDownloaded,
  updateError,
  updateNotAvailable,
} from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.actions.js'
import { updaterEvents } from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.utils.js'

export default function (store: any) {
  log.info('Current version:', version)
  store.dispatch(currentVersion({ version }))

  updaterEvents.on('update-available', () => store.dispatch(updateAvailable()))
  updaterEvents.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info.version)
    store.dispatch(
      updateDownloaded({
        update: undefined,
        version: info.version,
        platform: info.platform,
        readme: info.releaseNotes || '',
      }),
    )
  })
  updaterEvents.on('error', (error) => {
    log.info('Update Error:', error && error.message)
    setTimeout(() => store.dispatch(updateError(error)), 1)
  })
  updaterEvents.on('update-not-available', () => store.dispatch(updateNotAvailable()))

  if (store.getState().system.settings.autoUpdate) {
    store.dispatch(checkForUpdates())
  }
}
