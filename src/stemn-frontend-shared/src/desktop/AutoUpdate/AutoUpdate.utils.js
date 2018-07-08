import updater from 'electron-simple-updater'

export const checkForUpdates = () => {
  updater.checkForUpdates()
  return ''
}
export const installUpdates = () => {
  updater.quitAndInstall()
}
