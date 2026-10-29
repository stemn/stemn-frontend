/**
 * Window registry and the secure BrowserWindow factory shared by every Stemn window.
 *
 * Security model (Electron 45 defaults, kept on for all app windows):
 *   contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true
 * The renderers only talk to the main process through the preload bridge
 * (app/preload/index.ts -> window.stemnDesktop). Windows only ever load the
 * bundled renderer (file:// in production, the electron-vite dev server in
 * development); any other navigation or window.open is denied and http(s)
 * links are handed to the OS browser.
 */
import { BrowserWindow, Menu, shell } from 'electron'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import log from 'electron-log/main'

const isDev = process.env.NODE_ENV === 'development'

/** The live windows: { main, menubar } hold { browserWindow, show }, previews is a Set of BrowserWindows */
export const windows = {
  main: undefined,
  menubar: undefined,
  trayIcon: undefined,
  previews: new Set(),
}

const rendererRoot = join(__dirname, '../renderer')
const rendererRootUrl = pathToFileURL(`${rendererRoot}/`).href

/** Is this url one of our own renderer pages? */
export const isAppUrl = (url) => {
  if (!url) return false
  if (process.env.ELECTRON_RENDERER_URL && url.startsWith(process.env.ELECTRON_RENDERER_URL)) return true
  return url.startsWith(rendererRootUrl)
}

const openExternalSafely = (url) => {
  if (/^(https?|mailto):/i.test(url)) {
    shell.openExternal(url).catch((error) => log.warn('openExternal failed', url, error.message))
  } else {
    log.warn('Blocked opening url', url)
  }
}

/** Load a renderer entry (`main`, `menubar`, `preview`) with an optional hash route */
export const loadRenderer = (browserWindow, name, hash = '') => {
  const routeHash = hash.replace(/^#/, '')
  if (process.env.ELECTRON_RENDERER_URL) {
    return browserWindow.loadURL(
      `${process.env.ELECTRON_RENDERER_URL}/${name}/index.html${routeHash ? `#${routeHash}` : ''}`,
    )
  }
  return browserWindow.loadFile(join(rendererRoot, name, 'index.html'), routeHash ? { hash: routeHash } : undefined)
}

/** Name of the window that owns these webContents: 'main' | 'menubar' | 'preview' | undefined */
export const getWindowName = (webContents) => {
  const browserWindow = BrowserWindow.fromWebContents(webContents)
  if (!browserWindow) return undefined
  if (windows.main && windows.main.browserWindow === browserWindow) return 'main'
  if (windows.menubar && windows.menubar.browserWindow === browserWindow) return 'menubar'
  if (windows.previews.has(browserWindow)) return 'preview'
  return undefined
}

/** BrowserWindows for an action scope name */
export const getBrowserWindows = (name) => {
  if (name === 'main') return windows.main && windows.main.browserWindow ? [windows.main.browserWindow] : []
  if (name === 'menubar') return windows.menubar && windows.menubar.browserWindow ? [windows.menubar.browserWindow] : []
  if (name === 'preview') return [...windows.previews]
  return []
}

export const createAppWindow = ({ name, ...options }) => {
  const browserWindow = new BrowserWindow({
    show: false,
    ...options,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      spellcheck: false,
    },
  })

  const { webContents } = browserWindow

  // Only our own pages may be loaded in app windows
  webContents.on('will-navigate', (event, url) => {
    if (!isAppUrl(url)) {
      event.preventDefault()
      openExternalSafely(url)
    }
  })
  webContents.setWindowOpenHandler(({ url }) => {
    openExternalSafely(url)
    return { action: 'deny' }
  })
  webContents.on('will-attach-webview', (event) => event.preventDefault())

  webContents.on('render-process-gone', (event, details) => {
    log.error(`Renderer of the ${name} window is gone:`, details.reason, details.exitCode)
  })
  webContents.on('preload-error', (event, preloadPath, error) => {
    log.error(`Preload error in the ${name} window:`, error)
  })

  // Renderer warnings/errors end up in the main log (STEMN_LOG_RENDERER_CONSOLE=1, set by the e2e tests)
  if (process.env.STEMN_LOG_RENDERER_CONSOLE) {
    webContents.on('console-message', ({ level, message, lineNumber, sourceId }) => {
      if (level === 'warning' || level === 'error') {
        log[level === 'error' ? 'error' : 'warn'](`[console:${name}] ${message} (${sourceId}:${lineNumber})`)
      }
    })
  }

  // Mouse back/forward buttons (Windows)
  browserWindow.on('app-command', (event, command) => {
    if (command === 'browser-backward' && webContents.navigationHistory.canGoBack()) {
      webContents.navigationHistory.goBack()
    } else if (command === 'browser-forward' && webContents.navigationHistory.canGoForward()) {
      webContents.navigationHistory.goForward()
    }
  })

  if (isDev) {
    webContents.on('context-menu', (event, { x, y }) => {
      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => webContents.inspectElement(x, y),
        },
      ]).popup({ window: browserWindow })
    })
  }

  browserWindow.setMenu(null)
  return browserWindow
}
