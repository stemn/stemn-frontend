import { ipcRenderer } from 'electron'
import { loadUserData } from 'stemn-shared/misc/Auth/Auth.actions.js'
import { getInstallStatus } from 'stemn-shared/desktop/System/System.actions.js'
import http from 'axios'
import { remote } from 'electron'
import { relaunch } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'


export default (store, rendererType) => {
  ipcRenderer.on('redux-action', (event, payload) => {
    store.dispatch(payload)
  })


  // Dispatch some initialisation actions
  const state = store.getState()

  // Setup the http interceptor
  http.interceptors.request.use((config) => {
    const token = store.getState().auth.authToken

    if (config.headers.Authorization === null) {
      // We set Authorization to null to bypass
      delete config.headers.Authorization
    } else if (!config.headers.Authorization) {
      config.headers.Authorization = token ? `bearer ${token}` : ''
    }
    return config
  })

  // Dispatch some initial actions
  if (rendererType === 'main' && state.auth.authToken) {
    setTimeout(() => store.dispatch(loadUserData()), 1)
  }

  // Setup the error interceptor
  const exceptionHandler = {
    isOpen: false,
  }
  const oldOnError = window.onerror
  window.onerror = function () {
    if (!exceptionHandler.isOpen) {
      //      if (arguments) {
      //        exceptionHandler.isOpen = true
      //        remote.dialog.showMessageBox({
      //          title: 'Somthing went wrong',
      //          message: `Looks like there is a bug here. This has been sent for analysis.\r\r${JSON.stringify(arguments[0])}`,
      //          buttons: ['Try again', 'Restart'],
      //        }, (response) => {
      //          if (response === 0) {
      //            window.history.back()
      //            location.reload()
      //          } else if (response === 1) {
      //            store.dispatch(relaunch())
      //          }
      //          exceptionHandler.isOpen = false
      //        })
      //      }

      // Call any previously assigned handler
      if (oldOnError) {
        oldOnError.apply(this, arguments)
      }
    }
  }
}
