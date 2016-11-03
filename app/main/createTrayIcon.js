import path from 'path';
import { Tray, Menu, shell } from 'electron';
import process from 'process';

// Actions
import * as ElectronWindowsActions from '../shared/modules/ElectronWindows/ElectronWindows.actions.js';
import { push } from 'react-router-redux';


const trayIcon = path.join(__dirname, '../renderer/assets/images/logo.png');
let appIcon = null;

export function create({store, windows}) {
  if (appIcon !== null) return appIcon;
  
  const { dispatch } = store;
  
  appIcon = new Tray(trayIcon);
  appIcon.setToolTip('Stemn Desktop');
  
  if(process.platform == 'win32'){

//    appIcon.setContextMenu(contextMenu);
  }

  appIcon.on('right-click', (event, trayBounds) => {
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Main Window',
        click: () => dispatch(ElectronWindowsActions.show('main'))
      }, {
        label: 'Open Mini Window',
        click: () => windows.menubar.show()
      }, {
        label: 'Open Website',
        click: () => shell.openExternal('https://stemn.com')
      }, {
        type: 'separator'
      }, {
        label: 'Preferences',
//        accelerator: 'Ctrl+P',
        click: () => dispatch(push({
          pathname: '/settings/application',
          state: {meta : {scope: ['main']}}
        }))
      },{
        label: 'Account Settings',
        enabled: false,
        onClick: () => dispatch(push({
          pathname: '/settings/account',
          state: {meta : {scope: ['main']}}
        }))
      }, {
        type: 'separator'
      }, {
        label: 'Quit',
        accelerator: 'Ctrl+Q',
        click: () => dispatch(ElectronWindowsActions.quit())
      }
    ])
    appIcon.popUpContextMenu(contextMenu)
  });
  appIcon.on('click', (event, trayBounds) => {
    windows.menubar.show({reposition: true})
  });
  appIcon.on('double-click', (event, trayBounds) => {
    windows.main.show()
  });

  return appIcon;
}
