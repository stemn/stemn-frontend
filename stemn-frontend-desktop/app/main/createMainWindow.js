import { screen } from 'electron'
import { createAppWindow, loadRenderer, windows } from './windows.js'

const isDev = process.env.NODE_ENV === 'development'

export const create = ({ uri = '/' } = {}) => {
  let browserWindow = null

  const init = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize
    browserWindow = createAppWindow({
      name: 'main',
      width,
      height,
      minWidth: 500,
      minHeight: 500,
      title: 'Stemn',
      // The renderer draws its own title bar except on macOS
      frame: process.platform === 'darwin',
    })

    // If the renderer crashes, recreate the window
    browserWindow.webContents.on('render-process-gone', (event, { reason }) => {
      if (reason !== 'clean-exit' && browserWindow && !browserWindow.isDestroyed()) {
        browserWindow.destroy()
        init()
      }
    })
    browserWindow.on('closed', () => {
      browserWindow = null
      handle.browserWindow = null
    })

    loadRenderer(browserWindow, 'main', uri)
    if (isDev && !process.env.STEMN_NO_DEVTOOLS) {
      browserWindow.webContents.openDevTools({ mode: 'detach' })
    }
    handle.browserWindow = browserWindow
  }

  const show = () => {
    if (!browserWindow) init()
    if (browserWindow.isMinimized()) browserWindow.restore()
    browserWindow.show()
    browserWindow.focus()
  }

  const handle = { browserWindow, show }
  init()
  windows.main = handle
  return handle
}
