/**
 * Replaces stemn-frontend-desktop/app/main/postStoreSetup.js. The stemn:// handler registration
 * (Electron: app.setAsDefaultProtocolClient) is done by Rust (tauri-plugin-deep-link) at startup.
 */
import { values } from 'lodash'
import { getInstallStatus, getProviderPath } from 'stemn-shared/desktop/System/System.actions.js'
import * as shellContext from 'stemn-shared/desktop/Shell/ShellContext/ShellContext.actions.js'
import { getPlatform } from 'stemn-shared/desktop/bridge'

export default (store: any) => {
  store.dispatch(getProviderPath())
  store.dispatch(getInstallStatus())

  // Windows explorer context menu ("View revisions in Stemn") for the Dropbox/Drive folders
  if (getPlatform() === 'win32') {
    setTimeout(() => {
      store.dispatch(
        shellContext.updateConfig({ folders: values(store.getState().system.providerPath).filter(Boolean) }),
      )
      store.dispatch(shellContext.enable())
    }, 1000)
  }
}
