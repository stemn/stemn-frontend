import { app, BrowserWindow, Menu, shell } from 'electron';
import path from 'path';

const mainHtml = path.join(__dirname, '../../renderer/assets/html/preview.html');

let browserWindow = null;

export const show = () => {
  browserWindow.show();
  browserWindow.focus();
}

export const create =  function createWindow({ uri = '/' } = {}) {
  browserWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    minWidth: 1000,
    minHeight: 800,
//    frame: false
  });
  browserWindow.loadURL(`file://${mainHtml}#${uri}`);
  browserWindow.on('closed', () => {
    browserWindow = null;
  });
  if (process.env.NODE_ENV === 'development') {
    browserWindow.openDevTools();
    browserWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props;
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          browserWindow.inspectElement(x, y);
        }
      }]).popup(browserWindow);
    });
  }
  browserWindow.webContents.on('did-finish-load', () => {
    show();
  });
  browserWindow.setMenu(null);
}
