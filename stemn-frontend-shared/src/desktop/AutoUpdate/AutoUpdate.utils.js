/* Main process only (called through FunctionLibrary aliases) */
import { app } from 'electron'
import electronUpdater from 'electron-updater'

const { autoUpdater } = electronUpdater

export const checkForUpdates = () => {
  // Unpackaged (dev) builds have no app-update.yml, and on Linux only AppImages
  // can update themselves: report "up to date"
  if (!app.isPackaged || (process.platform === 'linux' && !process.env.APPIMAGE)) {
    autoUpdater.emit('update-not-available')
    return ''
  }
  autoUpdater.checkForUpdates().catch(() => {}) // errors are reported through the 'error' event
  return ''
}

export const installUpdates = () => {
  autoUpdater.quitAndInstall()
}
