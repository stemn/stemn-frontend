import './init.js';
import os from 'os';
import { app, ipcMain, dialog, crashReporter } from 'electron';
import pify from 'pify';
const jsonStorage = pify(require('electron-json-storage'))
import { create as createMainWindow } from './createMainWindow';
import { create as createMenubarWindow } from './createMenuBarWindow';
import { initialise as wsInitialise, write as wsWrite } from './modules/websocket/websocket.js';
import configureStore from '../shared/store/configureStore.main.js';
import { create as createTrayIcon } from './createTrayIcon.js';
import AutoUpdateInit from '../shared/modules/AutoUpdate/AutoUpdate.init.js';
import squirrelStartup from 'electron-squirrel-startup';
import mapWebsocketToRedux from './modules/websocket/mapWebsocketToRedux'
import { getProviderPath } from '../shared/modules/System/System.actions.js';
import { getFilteredStoreData } from './json-storage.js';
import log from 'electron-log';
import postStoreSetup from './postStoreSetup.js';
import initApiServer from './api/index.js';

// Actions
import * as ElectronWindowsActions from '../shared/modules/ElectronWindows/ElectronWindows.actions.js';

// The windows object is exported so it can be accessed elsewhere
export const windows = {
  main: undefined,
  menubar: undefined,
  trayIcon: undefined
}

let store = {};

/***********************************************************************************************

STARTUP FLAGS:
Hidden mode can be activated using a flag such as "--hidden" in the args:
  "C:\Users\david\AppData\Local\STEMN\update.exe" --processStart "STEMN.exe"
  --process-start-args "--hidden"

Additionally, the local-path to a file can be passed in such as:
  "C:\Users\david\AppData\Local\STEMN\update.exe" --processStart "STEMN.exe" --path "E:\Dropbox
  (Platino Properties)\David Revay Resume.pdf"

If a file-path is found a preview-window will pop that attempts to display revisions for that
file.

***********************************************************************************************/

log.info('---------------- Application started ----------------');

if(!squirrelStartup){
  global.state = {}; // Ease remote-loading of initial state

  require('electron-debug')({enabled: true});

  // Make this a single instance application
  const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    const args = getArgs(commandLine)
    // If the args include input.path - show the preview window
    if(args.inputs.path){
      showPreview(store.dispatch, args.inputs.path)
    }
    else if(windows.main.show){
      windows.main.show()
    }
  })
  
  if (shouldQuit) {
    app.quit()
  }

  app.on('ready', () => {
    start().catch((err) => {
      log.error('Startup error:', err);
      dialog.showErrorBox('Something went wrong:', err.message);
    });
  });
  app.on('activate', onActivate);
}

async function start() {
  const args = getArgs(process.argv);
  log.info('Startup mode flags:', args);

  // Clear Session State from the JSON store
  await jsonStorage.set('sessionState', {});

  // Fetch the permanant portion of the state
  global.state = await jsonStorage.get('state').catch(error => {
    log.error('Invalid state store:', error);
    jsonStorage.clear();
    return {};
  });

  // Configure store
  store = configureStore(global.state);
  postStoreSetup(store);
  
  store.subscribe(async () => {
    global.state = store.getState();
    const dataToStore = getFilteredStoreData(global.state);
    await jsonStorage.set('state', dataToStore);
    await jsonStorage.set('sessionState',  global.state);
  });

  // Initialise the api server
  initApiServer(store);

  // Create windows and tray icon
  windows.main     = createMainWindow();
  windows.menubar  = createMenubarWindow();
  windows.trayIcon = createTrayIcon({store, windows});

  // Show the main window if it is not started in hidden mode
  if(!args.mode.hidden){
    windows.main.show();
  }  
  // Show the preview window if we have a path argv
  if(args.inputs.path){
    showPreview(store.dispatch, args.inputs.path)
  }
//  showPreview(store.dispatch, 'E:\\Dropbox (Platino Properties)\\David Revay Resume.pdf')
  showPreview(store.dispatch, 'E:\\Dropbox (Platino Properties)\\Spaceman256.png')


  // Initialise the Websocket connection
  const websocket = wsInitialise(process.env.WEBSOCKET_SERVER);
  websocket.on('data', (action) => {
    const reduxAction = mapWebsocketToRedux(store, action);
    if(reduxAction){
      store.dispatch(reduxAction)
    };
  })

  // auto-updating
  setTimeout(() => {
    AutoUpdateInit(store);
  }, 5000);
}

function getArgs(argv){
  const pathFlagIndex = argv.indexOf('--path');
  const pathIndex = pathFlagIndex != -1 ? pathFlagIndex + 1 : -1;
  log.info('argv', argv)
  return {
    mode: {
      hidden: argv && argv.includes('--hidden')
    },
    inputs: {
      path: argv && pathIndex != -1 ? argv[pathIndex] : undefined
    }
  }
}

function showPreview(dispatch, path){
  log.info('path to show preview', path);
  if(dispatch && path){
    dispatch(ElectronWindowsActions.create({
      type: 'PREVIEW',
      props: {
        localPath: path
      }
    }))
  }
}

function onActivate(){
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  windows.main = createMainWindow();
}
