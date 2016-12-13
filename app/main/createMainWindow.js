import { app, BrowserWindow, Menu, shell, screen } from 'electron';
import path from 'path';
import process from 'process';
import log from 'electron-log';

const mainHtml = path.join(__dirname, '../renderer/assets/html/main.html');

export const create = function createWindow({ uri = '/' } = {}) {
  let browserWindow = null;
  const primarySize = screen.getPrimaryDisplay().workAreaSize;
  const sizeRatio = 1;
  
  init();
  return {
    browserWindow: browserWindow,
    show: show
  };

  ////////////////////////////////////////////

  function init () {
    browserWindow = new BrowserWindow({
      show: false,
      width: primarySize.width * sizeRatio,
      height: primarySize.height * sizeRatio,
      minWidth: 500,
      minHeight: 500,
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
  }
  function show () {
    if(!browserWindow){ init() };
    if (browserWindow.isMinimized()){
      browserWindow.restore();
    }
    browserWindow.show();
    browserWindow.focus();
  }
}


