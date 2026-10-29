import { app } from 'electron'
import log from 'electron-log/main'
import { values } from 'lodash'
import { getProviderPath, getInstallStatus } from 'stemn-shared/desktop/System/System.actions.js'
import * as shellContext from 'stemn-shared/desktop/Shell/ShellContext/ShellContext.actions.js'

export default (store) => {
  // Dispatch redux initial events
  store.dispatch(getProviderPath())
  store.dispatch(getInstallStatus())

  // Windows explorer context menu ("View revisions in Stemn") for the Dropbox/Drive folders
  if (process.platform === 'win32') {
    setTimeout(() => {
      store.dispatch(shellContext.updateConfig({
        folders: values(store.getState().system.providerPath).filter(Boolean),
      }))
      store.dispatch(shellContext.enable())
    }, 1000)
  }

  // stemn:// links open the app (registered by the installer in packaged builds)
  if (app.isPackaged && !app.isDefaultProtocolClient('stemn')) {
    if (!app.setAsDefaultProtocolClient('stemn')) {
      log.warn('Could not register the stemn:// protocol handler')
    }
  }
}
