import { app, BrowserWindow, Menu, shell, screen } from 'electron';
import { bindBackForward } from './utils/browserWindowUtils.js'
import path from 'path';
import stringify from './utils/stringify.js'

const mainHtml = process.env.NODE_ENV === 'development' 
               ? path.join(__dirname, '../../app/renderer/assets/html/preview.html')
               : path.join(__dirname, '../renderer/assets/html/preview.html');


export const create = function createWindow({ uri = '/' } = {}) {
  const primarySize = screen.getPrimaryDisplay().workAreaSize;
  const sizeRatio = 0.8;

  // Create a new stringified state global - this will be parsed in the renderer
  global.stateStringified = stringify(global.state);

  let browserWindow = new BrowserWindow({
    show: false,
    width: primarySize.width * sizeRatio,
    height: primarySize.height * sizeRatio,
    minWidth: 1000,
    minHeight: 600,
    frame: process.platform == 'darwin' ? true : false
  });

  browserWindow.loadURL(`file://${mainHtml}#${uri}`);
  browserWindow.on('closed', () => {
    browserWindow = null;
  });
  bindBackForward(browserWindow);



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
