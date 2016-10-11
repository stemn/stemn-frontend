import path from 'path';
import { Tray, Menu } from 'electron';

import { showMainWindow } from './createMainWindow';


const trayIcon = path.join(__dirname, '../renderer/assets/images/logo.png');
let appIcon = null;

export default function create() {
  if (appIcon !== null) return appIcon;
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Main Window',
      click: function () {
        showMainWindow()
      }
    }, {
      type: 'separator'
    }, {
      label: 'Preferences',
      accelerator: 'Ctrl+P',
    }, {
      label: 'Check for Updates',
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Ctrl+Q',
      role: 'quit',
      click: function () {
        event.sender.send('tray-removed')
        trayIcon.destroy()
      }
    }
  ])
  appIcon = new Tray(trayIcon);
  appIcon.setToolTip('STEMN Sync');
  appIcon.setContextMenu(contextMenu)

  return appIcon;
}
