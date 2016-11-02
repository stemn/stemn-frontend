import './init.js';
import os from 'os';
import { app, ipcMain, dialog } from 'electron';
import pify from 'pify';
const jsonStorage = pify(require('electron-json-storage'))
import { createMainWindow, showMainWindow } from './createMainWindow';
import { createMenuBar, showMenuWindow } from './createMenuBarWindow';
import { initialise as wsInitialise, write as wsWrite } from './modules/websocket/websocket.js';
import configureStore from '../shared/store/configureStore.main.js';
import tray from './tray';
import AutoUpdateInit from '../shared/modules/AutoUpdate/AutoUpdate.init.js';
import squirrelStartup from 'electron-squirrel-startup';
import mapWebsocketToRedux from './modules/websocket/mapWebsocketToRedux'
import { getProviderPath } from '../shared/actions/system';
import { getFilteredStoreData } from './json-storage.js';



if(!squirrelStartup){
  global.state = {}; // Ease remote-loading of initial state
  
  require('electron-debug')({enabled: true});

  // Make this a single instance application
  const shouldQuit = app.makeSingleInstance((commandLine, workingDirectory) => {
    showMainWindow();
  })
  if (shouldQuit) {
    app.quit()
  }
  

  app.on('ready', () => {
    start().catch((err) => {
      dialog.showErrorBox('Something went wrong:', err.message);
    });
  });
}

/////////////////////////////////////////////////////////////////


async function start() {
  const appIcon = tray(); // set-up menu bar

  // Clear sessionState
  await jsonStorage.set('sessionState', {});

  // Fetch perma-state
  global.state = await jsonStorage.get('state').
  catch(error => {
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

  ipcMain.on('electron-action', onElectronAction);
  app.on('window-all-closed',   onCloseAllWindows);
  app.on('activate',            onActivate);
  appIcon.on('click',           onClickAppIcon);
  appIcon.on('right-click',     ()=>{console.log('right click');});

  // init
  createMainWindow();
  store.dispatch(getProviderPath());


  // Init Websockets
  const websocket = wsInitialise({
   host : `http://${process.env.WEBSOCKET_SERVER}`,
   port : 8000
  });

  websocket.on('data', (action) => {
    console.log('websocket received data\n', JSON.stringify(action))
    const reduxAction = mapWebsocketToRedux(action);
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
  createMainWindow();
}

function onClickAppIcon(event, trayBounds){
  console.log('click');
  createMenuBar({ trayBounds });
  showMenuWindow();
}

function onCloseAllWindows(){
  if (process.platform !== 'darwin') app.quit();
}

function onElectronAction(event, action){
  if(action.type == 'WINDOW_MAIN_OPEN'){
    showMainWindow();
  }
  else if(action.type == 'WINDOW_MENUBAR_CLOSE'){
    console.log('Close Menubar');
  }
}
