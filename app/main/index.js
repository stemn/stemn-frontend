import os from 'os';
import { app, ipcMain, dialog } from 'electron';
//import pify from 'pify';
//import jsonStorage from 'electron-json-storage';
import { createMainWindow, showMainWindow } from './createMainWindow';
import { createMenuBar, showMenuWindow } from './createMenuBarWindow';
import configureStore from '../shared/store/configureStore';
import tray from './tray';
import autoUpdater from './tasks/autoUpdater';
import squirrelStartup from 'electron-squirrel-startup';
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

    store.subscribe(async () => {
      global.state = store.getState();
      // persist store changes
      // TODO: should this be blocking / wait? _.throttle?

//      console.log(global.state);
//      await storage.set('state', global.state);
    });

    ipcMain.on('redux-action', (event, payload) => {
      store.dispatch(payload);
    });

    ipcMain.on('electron-action', (event, payload) => {
      if(payload.type == 'WINDOW_MAIN_OPEN'){
        showMainWindow();
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

