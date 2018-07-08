import './init.js'

import squirrelStartup from 'electron-squirrel-startup'
import { app, dialog } from 'electron'
import pify from 'pify'
import log from 'electron-log'

import { create as createMainWindow }     from './createMainWindow'
import { create as createMenubarWindow }  from './createMenuBarWindow'
import { create as createTrayIcon }       from './createTrayIcon.js'

import { initialise as initWebsocket } from 'stemn-shared/misc/Websocket/websocket.js'
import socketEventMap from 'stemn-shared/misc/Websocket/eventMap'
import AutoUpdateInit from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.init.js'
import configureStore from '../shared/store/configureStore.main.js'
import { getFilteredStoreData } from './json-storage.js'
import postStoreSetup from './postStoreSetup.js'
import initApiServer from './api/index.js'
import stringify from './utils/stringify.js'
import { create as createWindow } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import electronJsonStorage from 'electron-json-storage'

const jsonStorage = pify(electronJsonStorage)

// The windows object is exported so it can be accessed elsewhere
export const windows = {
  main: undefined,
  menubar: undefined,
  trayIcon: undefined,
}

let store = {}

// Function for processing the argument string into an object
const getArgs = (argv) => {
  const pathFlagIndex = argv.indexOf('--path')
  const pathIndex = pathFlagIndex !== -1 ? pathFlagIndex + 1 : -1
  return {
    mode: {
      hidden: argv && argv.includes('--hidden'),
    },
    inputs: {
      path: argv && pathIndex !== -1 ? argv[pathIndex] : undefined,
    },
  }
}

const showPreview = (dispatch, localPath) => {
  log.info('path to show preview', localPath)
  if (dispatch && localPath) {
    dispatch(createWindow({
      type: 'PREVIEW',
      props: {
        localPath,
      },
    }))
  }
}

/** *********************************************************************************************

STARTUP FLAGS:
Hidden mode can be activated using a flag such as "--hidden" in the args:
  "C:\Users\david\AppData\Local\STEMN\update.exe" --processStart "STEMN.exe"
  --process-start-args "--hidden"

Additionally, the local-path to a file can be passed in such as:
  "C:\Users\david\AppData\Local\STEMN\update.exe" --processStart "STEMN.exe" --path "E:\Dropbox
  (Platino Properties)\David Revay Resume.pdf"

If a file-path is found a preview-window will pop that attempts to display revisions for that
file.

********************************************************************************************** */

log.info('Application started')

if (!squirrelStartup) {
  global.state = {} // Ease remote-loading of initial state

  require('electron-debug')({ enabled: true })

  // Make this a single instance application
  const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    const args = getArgs(commandLine)
    // If the args include input.path
    // A second instance was started from the explorer context menu
    // Show the preview window
    if (args.inputs.path) {
      log.info('Preview flags:', args)
      showPreview(store.dispatch, args.inputs.path)
    } else if (windows.main.show) {
      windows.main.show()
    }
  })

  // Quit the app if this is a second instance
  if (shouldQuit) {
    app.quit()
  }

  app.on('ready', () => {
    start().catch((err) => {
      log.error('Startup error:', err)
      dialog.showErrorBox('Something went wrong:', err.message)
    })
  })

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    windows.main = createMainWindow()
  })
}

async function start() {
  const args = getArgs(process.argv)
  log.info('Start flags:', args)

  // Fetch the permanant portion of the state
  global.state = await jsonStorage.get('state').catch((error) => {
    log.error('Invalid state store:', error)
    jsonStorage.clear()
    return {}
  })

  // Configure store
  store = configureStore(global.state)
  postStoreSetup(store)
  store.subscribe(async () => {
    global.state = store.getState()
    global.stateStringified = stringify(global.state)
    const dataToStore = getFilteredStoreData(global.state)
    await jsonStorage.set('state', dataToStore)
  })

  // Initialise the api server
  initApiServer(store)

  // Create windows and tray icon
  windows.main = createMainWindow()
  windows.menubar = createMenubarWindow()
  windows.trayIcon = createTrayIcon({ store, windows })

  // Show the main window if it is not started in hidden mode
  if (!args.mode.hidden) {
    windows.main.show()
  }

  // Show the preview window if we have a path argv
  if (args.inputs.path) {
    showPreview(store.dispatch, args.inputs.path)
  }
  //  showPreview(store.dispatch, 'E:\\Dropbox (Platino Properties)\\David Revay Resume.pdf')
  //  showPreview(store.dispatch, 'E:\\Dropbox (Platino Properties)\\Spaceman256.png')
  //  showPreview(store.dispatch, 'E:\\Dropbox (Platino Properties)\\STEMN Projects\\Gear Changes\\httpMiddleware.js')

  // Initialise the Websocket connection
  const websocket = initWebsocket(GLOBAL_ENV.WEBSOCKET_SERVER)
  websocket.on('data', (action) => {
    socketEventMap(store, action)
  })

  // Initialise the auto-update after 5 seconds
  setTimeout(() => {
    AutoUpdateInit(store)
  }, 5000)
}
