import os from 'os';
import { app, ipcMain, dialog } from 'electron';
//import pify from 'pify';
//import jsonStorage from 'electron-json-storage';
import { createMainWindow, showMainWindow } from './createMainWindow';
import { createMenuBar, showMenuWindow } from './createMenuBarWindow';

//import { authInit, authReducer } from './modules/auth/auth.js';
import { initialise as wsInitialise, write as wsWrite } from './modules/websocket/websocket.js';

import configureStore from '../shared/store/configureStore';
import tray from './tray';
import autoUpdater from './tasks/autoUpdater';
import squirrelStartup from 'electron-squirrel-startup';

import mapWebsocketToRedux from './modules/websocket/mapWebsocketToRedux'

import { getProviderPath } from '../shared/actions/system';


//import * as Test1 from 'C:/Git/stemn-electron-2/package.json';
//import * as Test2 from 'app/main/tray.js';


  //import reminder from './tasks/reminder';


//let monkey = require('node-monkey')([options]);
//
//// Do this if you want to bind to the console and have all output directed to the browser
//// Pass `true` to disable server side logging and only see output in the browser
//monkey.attachConsole()

console.log(squirrelStartup);
// Init squirel setup hooks
if(!squirrelStartup){
  // we have to do this to ease remote-loading of the initial state :(
  global.state = {};

//  const storage = pify(jsonStorage);

  if (process.env.NODE_ENV === 'development') {
    require('electron-debug')(); // eslint-disable-line global-require
  }


  async function start() {
    // set-up menu bar
    const appIcon = tray();

//    await storage.remove('state'); // Clear all storage in dev:
//    global.state = await storage.get('state');

    const store = configureStore(global.state, 'main');

//    const websocket = wsInitialise({
//      host : `https://${process.env.WEBSOCKET_SERVER}`,
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

    store.subscribe(async () => {
      global.state = store.getState();
      // persist store changes
      // TODO: should this be blocking / wait? _.throttle?

//      console.log(global.state);
//      await storage.set('state', global.state);
    });

    ipcMain.on('redux-action', (event, action) => {
      store.dispatch(action);
    });

    ipcMain.on('electron-action', (event, action) => {
      if(action.type == 'WINDOW_MAIN_OPEN'){
        showMainWindow();
      }
      else if(action.type == 'WINDOW_MENUBAR_CLOSE'){
        console.log('Close Menubar');
      }
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') app.quit();
    });

    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      createMainWindow();
    });

    appIcon.on('click', (event, trayBounds) => {
      createMenuBar({ trayBounds });
      showMenuWindow();
    });

    // init
    createMainWindow();
    store.dispatch(getProviderPath());

    // auto-updating
    setTimeout(() => {
      autoUpdater(store);
    }, 5000);
  }


  app.on('ready', () => {
    start()
    .catch((err) => {
      dialog.showErrorBox('There\'s been an error', err.message);
    });
  });
}
