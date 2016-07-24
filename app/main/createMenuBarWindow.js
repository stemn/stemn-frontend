import { BrowserWindow, screen, Menu } from 'electron';
import path from 'path';
import process from 'process';
import Positioner from 'electron-positioner';

const menuBarHtml = path.join(__dirname, '../renderer/assets/html/menubar.html');
const WINDOW_WIDTH = 300;
const WINDOW_HEIGHT = 450;
const HORIZ_PADDING = 15;
const VERT_PADDING = 30;

let browserWindow = null;

export const createMenuBar = () => {
  if (browserWindow !== null) {
    return browserWindow;
  }

  browserWindow = new BrowserWindow({
    show: false,
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true
  });

  if (process.env.NODE_ENV === 'development') {
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

  browserWindow.loadURL(`file://${menuBarHtml}`);

  browserWindow.on('closed', () => {
    browserWindow = null;
  });

  browserWindow.on('blur', () => {
    browserWindow.hide();
  });

  return browserWindow;
}

export const showMenuWindow = () => {
    const cursorPosition = screen.getCursorScreenPoint();
    const primarySize = screen.getPrimaryDisplay().workAreaSize; // Todo: this uses primary screen, it should use current
    const trayPositionVert = cursorPosition.y >= primarySize.height/2 ? 'bottom' : 'top';
    const trayPositionHoriz = cursorPosition.x >= primarySize.width/2 ? 'right' : 'left';
    browserWindow.setPosition(getTrayPosX(),  getTrayPosY());
    browserWindow.show();
    browserWindow.focus();

    ///////////////////////

    function getTrayPosX(){
      // Find the horizontal bounds if the window were positioned normally
      const horizBounds = {
        left:   cursorPosition.x - WINDOW_WIDTH/2,
        right:  cursorPosition.x + WINDOW_WIDTH/2
      }
      // If the window crashes into the side of the screem, reposition
      if(trayPositionHoriz == 'left'){
        return horizBounds.left <= HORIZ_PADDING ? HORIZ_PADDING : horizBounds.left;
      }
      else{
        return horizBounds.right >= primarySize.width ? primarySize.width - HORIZ_PADDING - WINDOW_WIDTH: horizBounds.right - WINDOW_WIDTH;
      }
    }
    function getTrayPosY(){
      return trayPositionVert == 'bottom' ? cursorPosition.y - WINDOW_HEIGHT - VERT_PADDING : cursorPosition.y + VERT_PADDING;
    }
}
