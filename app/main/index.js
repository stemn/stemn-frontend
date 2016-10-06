import os from 'os';
import { app, ipcMain, dialog } from 'electron';
import pify from 'pify';
const jsonStorage = pify(require('electron-json-storage'))
import { createMainWindow, showMainWindow } from './createMainWindow';
import { createMenuBar, showMenuWindow } from './createMenuBarWindow';
import { initialise as wsInitialise, write as wsWrite } from './modules/websocket/websocket.js';
import configureStore from '../shared/store/configureStore';
import tray from './tray';
import autoUpdater from './tasks/autoUpdater';
import squirrelStartup from 'electron-squirrel-startup';
import mapWebsocketToRedux from './modules/websocket/mapWebsocketToRedux'
import { getProviderPath } from '../shared/actions/system';


if(!squirrelStartup){
  global.state = {}; // Ease remote-loading of initial state

  if (process.env.NODE_ENV === 'development') {
    require('electron-debug')(); // eslint-disable-line global-require
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
    global.state = await jsonStorage.get('state').catch(error => {
      jsonStorage.clear();
      return {};
    });

    const store = configureStore(global.state, 'main');

    store.subscribe(async () => {
      global.state = store.getState();
      await jsonStorage.set('state', global.state) // TODO: should this be blocking / wait? _.throttle?
    });
    ipcMain.on('redux-action', (event, action) => {
      store.dispatch(action);
    });

    ipcMain.on('electron-action', onElectronAction);
    app.on('window-all-closed',   onCloseAllWindows);
    app.on('activate',            onActivate);
    appIcon.on('click',           onClickAppIcon);

    // init
    createMainWindow();
    store.dispatch(getProviderPath());

    // auto-updating
    setTimeout(() => {
      autoUpdater(store);
    }, 5000);
  }

function onActivate(){
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  createMainWindow();
}

function onClickAppIcon(event, trayBounds){
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


//    const websocket = wsInitialise({
//      host : 'http://localhost',
//      port : 8080,
//      token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1NDk4ZTI1OGE3ZmJiZmNjMTJjM2ZhMTUiLCJpYXQiOjE0NzAzNTkzMjkuMDI5LCJleHAiOjE0NzU1NDMzMjkuMDI5fQ.mwhOEtyhzc7Cqg4r9JLKTxgwzr-YnDYdLKW_CNOGeuA'
//    });
//
//    websocket.on('data', (action) => {
//     const reduxAction = mapWebsocketToRedux(action);
//     if(reduxAction){
//       store.dispatch(reduxAction)
//     };
//    });
//
//    websocket.write({
//      type : 'CHANGES/FETCH_CHANGES',
//      payload : {
//        projectId : '57c77e2896f1d3a2604fc92c'
//      }
//    });
