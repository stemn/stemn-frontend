import { screen } from 'electron'
import { createAppWindow, loadRenderer, windows } from './windows.js'

const isDev = process.env.NODE_ENV === 'development'

/** A file preview window. `uri` is the hash route, e.g. `/?projectId=..&fileId=..&revisionId=..` */
export const create = ({ uri = '/' } = {}) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const sizeRatio = 0.8

  const browserWindow = createAppWindow({
    name: 'preview',
    width: Math.round(width * sizeRatio),
    height: Math.round(height * sizeRatio),
    minWidth: Math.min(1000, width),
    minHeight: Math.min(600, height),
    title: 'Stemn Preview',
    frame: process.platform === 'darwin',
  })
  windows.previews.add(browserWindow)
  browserWindow.on('closed', () => windows.previews.delete(browserWindow))

  loadRenderer(browserWindow, 'preview', uri)
  if (isDev && !process.env.STEMN_NO_DEVTOOLS) {
    browserWindow.webContents.openDevTools({ mode: 'detach' })
  }

  const show = () => {
    browserWindow.show()
    browserWindow.focus()
  }
  browserWindow.once('ready-to-show', show)

  return { browserWindow, show }
}
