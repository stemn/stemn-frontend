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
import { getProviderPath } from '../shared/actions/system';
import { getFilteredStoreData } from './json-storage.js';
import log from 'electron-log';
import http from 'axios'

export const windows = {
  main: undefined,
  menubar: undefined,
  trayIcon: undefined
}

/************************************************
Get the application start-type.

Hidden mode can be activated using a flag such as "--hidden" in the args
"C:\Users\david\AppData\Local\STEMN\update.exe" --processStart "STEMN.exe" --process-start-args "--hidden"
in the application shortcut
************************************************/
const modeFlags = {
  hidden: process.argv && process.argv[1] && process.argv[1] == '--hidden'
}
log.info('Application started');
log.info('Startup mode flags:', modeFlags);

if(!squirrelStartup){
  global.state = {}; // Ease remote-loading of initial state

  require('electron-debug')({enabled: true});

  // Make this a single instance application
  const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    if(windows.main.show){ windows.main.show() };
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

/////////////////////////////////////////////////////////////////

async function start() {

  // Clear Session State from the JSON store
  await jsonStorage.set('sessionState', {});

  // Fetch the permanant portion of the state
  global.state = await jsonStorage.get('state').
  catch(error => {
    log.error('Invalid state store:', error);
    jsonStorage.clear();
    return {};
  });

  // Configure store
  const store = configureStore(global.state);
  store.subscribe(async () => {
    global.state = store.getState();
    const dataToStore = getFilteredStoreData(global.state);
    await jsonStorage.set('state', dataToStore);
    await jsonStorage.set('sessionState',  global.state);
  });
  ipcMain.on('redux-action', (event, action) => {
    store.dispatch(action);
  });

  // Create windows and tray icon
  windows.main     = createMainWindow();
  windows.menubar  = createMenubarWindow();
  windows.trayIcon = createTrayIcon({store, windows});

  // Show the main window if it is not started in hidden mode
  if(!modeFlags.hidden){
    windows.main.show();
  }

  // Dispatch redux initial events
  store.dispatch(getProviderPath());

  // Initialise the Websocket connection
  const websocket = wsInitialise(process.env.WEBSOCKET_SERVER);
  websocket.on('data', (action) => {
    log.info('websocket received data\n', JSON.stringify(action))
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

function onActivate(){
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  windows.main = createMainWindow();
}
