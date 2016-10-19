import { app, BrowserWindow, Menu, shell } from 'electron';
import path from 'path';
import process from 'process';

const mainHtml = path.join(__dirname, '../renderer/assets/html/main.html');

let browserWindow = null;

export const showMainWindow = () => {
  //  browserWindow.maximize();
  browserWindow.show();
  browserWindow.focus();
}

export const createMainWindow =  function createWindow({ uri = '/' } = {}) {
  if (browserWindow !== null) {
    if (!browserWindow.webContents.isLoading()) {
      showMainWindow();
    }
    return browserWindow;
  }

  browserWindow = new BrowserWindow({
    show: false,
    width: 1000,
    height: 600,
    minWidth: 1000,
    minHeight: 600,
    frame: process.platform == 'darwin' ? true : false
  });

  function handleRedirect(e, url) {
    if (url !== browserWindow.webContents.getURL()) {
      e.preventDefault();
      shell.openExternal(url);
    }
  }

  browserWindow.loadURL(`file://${mainHtml}#${uri}`);

  browserWindow.on('closed', () => {
    browserWindow = null;
  });

  browserWindow.webContents.on('did-finish-load', () => {
    showMainWindow();
    console.log('load complete');
  });
  browserWindow.webContents.on('will-navigate', handleRedirect);
  browserWindow.webContents.on('new-window', handleRedirect);

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

  browserWindow.setMenu(null);


  return browserWindow;
}
