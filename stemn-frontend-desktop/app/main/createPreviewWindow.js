import { app, BrowserWindow, Menu, shell, screen } from 'electron'
import { bindBackForward } from './utils/browserWindowUtils.js'
import path from 'path'
import stringify from './utils/stringify.js'
import getRootPath from 'get-root-path'

const mainHtml = getRootPath('/static/html/preview.html')


export const create = function createWindow({ uri = '/' } = {}) {
  const primarySize = screen.getPrimaryDisplay().workAreaSize
  const sizeRatio = 0.8

  // Create a new stringified state global - this will be parsed in the renderer
  global.stateStringified = stringify(global.state)

  let browserWindow = new BrowserWindow({
    show: false,
    width: primarySize.width * sizeRatio,
    height: primarySize.height * sizeRatio,
    minWidth: 1000,
    minHeight: 600,
    frame: process.platform == 'darwin',
    webPreferences: {
      webSecurity: false, // TODO. Investiage security implications. This is needed for cross origin autodesk requests.
    },
  })

  browserWindow.loadURL(`${mainHtml}#${uri}`)
  browserWindow.on('closed', () => {
    browserWindow = null
  })
  bindBackForward(browserWindow)

  // Handle Redirects
  const handleRedirect = (e, url) => {
    if (url !== browserWindow.webContents.getURL()) {
      e.preventDefault()
      shell.openExternal(url)
    }
  }
  browserWindow.webContents.on('will-navigate', handleRedirect)
  browserWindow.webContents.on('new-window', handleRedirect)

  if (process.env.NODE_ENV === 'development') {
    browserWindow.openDevTools()
    browserWindow.webContents.on('context-menu', (e, props) => {
      const { x, y } = props
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click() {
          browserWindow.inspectElement(x, y)
        },
      }]).popup(browserWindow)
    })
  }

  //  browserWindow.webContents.on('did-finish-load', () => {
  //    browserWindow.show();
  //    browserWindow.focus();
  //  });

  show()
  browserWindow.setMenu(null)
  
  return {
    browserWindow,
    show,
  }
  
  function show() {
    browserWindow.show()
    browserWindow.focus()
  }
}
