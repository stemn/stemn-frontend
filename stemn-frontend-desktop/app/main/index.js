import './init.js'

import squirrelStartup from 'electron-squirrel-startup'
import { app, dialog } from 'electron'
import log from 'electron-log/main'

import { initialise as initWebsocket } from 'stemn-shared/misc/Websocket/websocket.js'
import socketEventMap from 'stemn-shared/misc/Websocket/eventMap'
import AutoUpdateInit from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.init.js'
import { create as createWindow } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import configureStore from '../shared/store/configureStore.main.js'
import { create as createMainWindow } from './createMainWindow'
import { create as createMenubarWindow } from './createMenuBarWindow'
import { create as createTrayIcon } from './createTrayIcon.js'
import { getFilteredStoreData, jsonStorage } from './json-storage.js'
import postStoreSetup from './postStoreSetup.js'
import initApiServer from './api/index.js'
import { registerIpcHandlers } from './ipc.js'
import { registerProtocolHandlers, registerSchemes } from './protocol.js'
import { getStore, setStore } from './storeRef.js'
import { windows } from './windows.js'

export { windows }

/** *********************************************************************************************

STARTUP FLAGS:
Hidden mode can be activated using a flag such as "--hidden" in the args.

Additionally, the local path to a file can be passed in with `--path <file>`
(this is what the Windows explorer context menu does). If a file path is found
a preview window pops up that displays the revisions for that file.

********************************************************************************************** */
const getArgs = (argv) => {
  const pathFlagIndex = argv.indexOf('--path')
  return {
    mode: {
      hidden: argv.includes('--hidden'),
    },
    inputs: {
      path: pathFlagIndex !== -1 ? argv[pathFlagIndex + 1] : undefined,
    },
  }
}

const showPreview = (localPath) => {
  log.info('path to show preview', localPath)
  const store = getStore()
  if (store && localPath) {
    store.dispatch(createWindow({
      type: 'PREVIEW',
      props: { localPath },
    }))
  }
}

async function start() {
  const args = getArgs(process.argv)
  log.info('Start flags:', args)

  registerProtocolHandlers()

  // Fetch the persisted portion of the state
  const persistedState = await jsonStorage.get('state').catch((error) => {
    log.error('Invalid state store:', error)
    return jsonStorage.clear().then(() => ({}))
  })

  // Configure store
  const store = configureStore(persistedState || {})
  setStore(store)
  registerIpcHandlers({ getStore })
  postStoreSetup(store)

  // Persist the store (debounced, writes are async)
  let saveTimeout
  store.subscribe(() => {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      jsonStorage.set('state', getFilteredStoreData(store.getState()))
        .catch(error => log.error('Could not save the state:', error))
    }, 250)
  })

  // Initialise the api server (OAuth callbacks)
  initApiServer(store)

  // Create windows and tray icon
  createMainWindow()
  createMenubarWindow()
  windows.trayIcon = createTrayIcon({ store, windows })

  // Show the main window if it is not started in hidden mode
  if (!args.mode.hidden) {
    windows.main.browserWindow.once('ready-to-show', () => windows.main.show())
  }

  // Show the preview window if we have a path argv
  if (args.inputs.path) {
    showPreview(args.inputs.path)
  }

  // Initialise the Websocket connection
  const websocket = initWebsocket(GLOBAL_ENV.WEBSOCKET_SERVER)
  websocket.on('open', () => log.info('Websocket connected to', GLOBAL_ENV.WEBSOCKET_SERVER))
  websocket.on('error', error => log.warn('Websocket error:', error && error.message))
  websocket.on('data', (action) => {
    if (process.env.STEMN_LOG_WEBSOCKET || store.getState().system.settings.debug) {
      log.info('Websocket received', action && action.type)
    }
    socketEventMap(store, action)
  })

  // Initialise the auto-update after 5 seconds
  setTimeout(() => AutoUpdateInit(store), 5000)
}

log.info(`Stemn Desktop ${app.getVersion()} starting (STEMN_ENV=${GLOBAL_ENV.STEMN_ENV}, API ${GLOBAL_ENV.API_SERVER})`)

if (squirrelStartup) {
  app.quit()
} else if (!app.requestSingleInstanceLock()) {
  // Another instance is running: it receives our argv through 'second-instance'
  app.quit()
} else {
  registerSchemes()
  app.enableSandbox()

  app.on('second-instance', (event, commandLine) => {
    const args = getArgs(commandLine)
    // A second instance was started from the explorer context menu: show the preview window
    if (args.inputs.path) {
      log.info('Preview flags:', args)
      showPreview(args.inputs.path)
    } else if (windows.main) {
      windows.main.show()
    }
  })

  // Keep running in the tray when every window is closed
  app.on('window-all-closed', () => {})

  app.on('activate', () => {
    // On macOS re-open the main window when the dock icon is clicked
    if (windows.main) windows.main.show()
  })

  app.whenReady()
    .then(start)
    .catch((err) => {
      log.error('Startup error:', err)
      dialog.showErrorBox('Something went wrong:', err.message)
    })
}
