import { app, BrowserWindow, Menu, shell, screen } from 'electron'
import { bindBackForward } from './utils/browserWindowUtils.js'
import path from 'path'
import process from 'process'
import log from 'electron-log'
import stringify from './utils/stringify.js'
import getRootPath from 'get-root-path'

const mainHtml = getRootPath('/static/html/main.html')

export const create = function createWindow({ uri = '/' } = {}) {
  let browserWindow = null
  const primarySize = screen.getPrimaryDisplay().workAreaSize
  const sizeRatio = 1
  
  init()
  return {
    browserWindow,
    show,
  }

  // //////////////////////////////////////////

  function init() {
    // Create a new stringified state global - this will be parsed in the renderer
    global.stateStringified = stringify(global.state)

    browserWindow = new BrowserWindow({
      show: false,
      width: primarySize.width * sizeRatio,
      height: primarySize.height * sizeRatio,
      minWidth: 500,
      minHeight: 500,
      frame: process.platform == 'darwin',
      webPreferences: {
        webSecurity: false, // TODO. Investiage security implications. This is needed for cross origin autodesk requests.
      },
    })


    // Handle Redirects
    const handleRedirect = (e, url) => {
      if (url !== browserWindow.webContents.getURL()) {
        e.preventDefault()
        shell.openExternal(url)
      }
    }
    browserWindow.webContents.on('will-navigate', handleRedirect)
    browserWindow.webContents.on('new-window', handleRedirect)
    
    browserWindow.loadURL(`${mainHtml}#${uri}`)
    browserWindow.on('closed', () => {
      browserWindow = null
    })

    bindBackForward(browserWindow)

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

    browserWindow.setMenu(null)
  }
  function show() {
    if (!browserWindow) { init() }
    if (browserWindow.isMinimized()) {
      browserWindow.restore()
    }
    browserWindow.show()
    browserWindow.focus()
  }
}

