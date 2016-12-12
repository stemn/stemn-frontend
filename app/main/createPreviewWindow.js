import { app, BrowserWindow, Menu, shell } from 'electron';
import path from 'path';

const mainHtml = path.join(__dirname, '../renderer/assets/html/preview.html');

export const create = function createWindow({ uri = '/' } = {}) {
  let browserWindow = new BrowserWindow({
    show: false,
    width: 1200,
    height: 720,
    minWidth: 1000,
    minHeight: 600,
    frame: process.platform == 'darwin' ? true : false
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

//  browserWindow.webContents.on('did-finish-load', () => {
//    browserWindow.show();
//    browserWindow.focus();
//  });

  show();
  browserWindow.setMenu(null);
  
  return {
    browserWindow: browserWindow,
    show: show
  }
  
  function show(){
    browserWindow.show();
    browserWindow.focus();
  }
}
