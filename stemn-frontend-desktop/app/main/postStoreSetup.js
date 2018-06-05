import http from 'axios'
import { values } from 'lodash'
import { ipcMain } from 'electron'
import { getProviderPath, getInstallStatus } from 'stemn-shared/desktop/System/System.actions.js'
import * as shellContext    from 'stemn-shared/desktop/Shell/ShellContext/ShellContext.actions.js'
import * as protocolHandler from 'stemn-shared/desktop/Shell/ProtocolHandler/ProtocolHandler.js'

export default (store) => {
  http.interceptors.request.use((config) => {
    const token = store.getState().auth.authToken
    config.headers.Authorization = token ? `bearer ${token}` : ''
    return config
  })
  
  ipcMain.on('redux-action', (event, action) => {
    store.dispatch(action)
  })
  
  // Dispatch redux initial events
  store.dispatch(getProviderPath())
  store.dispatch(getInstallStatus())

  // Dispatch context-menu setup
  setTimeout(() => {
    // Get set the Dropbox/Drive provider paths as the context-menu folders
    store.dispatch(shellContext.updateConfig({
      folders: values(store.getState().system.providerPath),
    }))
    // Enable the context menu
    store.dispatch(shellContext.enable())
  }, 1000)

  // Setup protocol handler
  const protocolHandlerInstance = protocolHandler.init({
    appName: 'Stemn',
    appPath: process.execPath,
  })
  protocolHandlerInstance.enable()
}
