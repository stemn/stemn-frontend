/**
 * Typed IPC handlers backing the preload bridge (app/preload/index.ts).
 * Every handler checks that the message comes from one of our own windows.
 */
import { BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { existsSync } from 'node:fs'
import log from 'electron-log/main'
import { IPC, WINDOW_NAMES } from '../shared/ipc/channels.js'
import { toIpcSafe } from '../shared/ipc/serialize.js'
import { getBrowserWindows, getWindowName, isAppUrl } from './windows.js'

const isTrustedSender = (event) => {
  const frameUrl = event.senderFrame && event.senderFrame.url
  return isAppUrl(frameUrl)
}

const guard =
  (handler) =>
  (event, ...args) => {
    if (!isTrustedSender(event)) {
      log.warn('Rejected IPC message from', event.senderFrame && event.senderFrame.url)
      throw new Error('Untrusted sender')
    }
    return handler(event, ...args)
  }

const scopeLocal = (action) => ({ ...action, meta: { ...action.meta, scope: 'local' } })

/** Send an action straight to the renderer store(s) of a named window */
export const sendToWindow = (name, action) => {
  const safeAction = toIpcSafe(scopeLocal(action))
  getBrowserWindows(name).forEach((browserWindow) => {
    if (!browserWindow.isDestroyed()) browserWindow.webContents.send(IPC.REDUX_ACTION, safeAction)
  })
}

/** Send an action to the renderer stores of every window */
export const sendToAllWindows = (action) => {
  const safeAction = toIpcSafe(scopeLocal(action))
  BrowserWindow.getAllWindows().forEach((browserWindow) => {
    if (!browserWindow.isDestroyed()) browserWindow.webContents.send(IPC.REDUX_ACTION, safeAction)
  })
}

const isExternalUrl = (url) => typeof url === 'string' && /^(https?|mailto):/i.test(url)

export const registerIpcHandlers = ({ getStore, getUpdater }) => {
  ipcMain.handle(
    IPC.GET_INITIAL_STATE,
    guard((event) => ({
      state: toIpcSafe(getStore().getState()),
      windowName: getWindowName(event.sender),
    })),
  )

  ipcMain.on(IPC.REDUX_ACTION, (event, action) => {
    if (!isTrustedSender(event) || !action || typeof action.type !== 'string') return
    getStore().dispatch(action)
  })

  ipcMain.on(IPC.FORWARD_TO_WINDOW, (event, { target, action } = {}) => {
    if (!isTrustedSender(event) || !WINDOW_NAMES.includes(target) || !action || typeof action.type !== 'string') return
    sendToWindow(target, action)
  })

  ipcMain.handle(
    IPC.WINDOW_COMMAND,
    guard((event, { command } = {}) => {
      const browserWindow = BrowserWindow.fromWebContents(event.sender)
      if (!browserWindow) return false
      switch (command) {
        case 'minimize':
          browserWindow.minimize()
          break
        case 'toggleMaximize':
          if (browserWindow.isMaximized()) browserWindow.unmaximize()
          else browserWindow.maximize()
          break
        case 'close':
          browserWindow.close()
          break
        case 'isMaximized':
          break
        default:
          throw new Error(`Unknown window command: ${command}`)
      }
      return browserWindow.isMaximized()
    }),
  )

  ipcMain.handle(
    IPC.SELECT_DIRECTORY,
    guard(async (event, { title, defaultPath, buttonLabel } = {}) => {
      const browserWindow = BrowserWindow.fromWebContents(event.sender)
      const { canceled, filePaths } = await dialog.showOpenDialog(browserWindow, {
        title,
        defaultPath: defaultPath || undefined,
        buttonLabel: buttonLabel || 'Select Folder',
        properties: ['openDirectory'],
      })
      return canceled || !filePaths[0] ? null : filePaths[0]
    }),
  )

  ipcMain.handle(
    IPC.OPEN_EXTERNAL,
    guard((event, url) => {
      if (!isExternalUrl(url)) throw new Error(`Refusing to open ${url}`)
      return shell.openExternal(url)
    }),
  )

  ipcMain.handle(
    IPC.OPEN_PATH,
    guard((event, path) => {
      if (typeof path !== 'string' || !path) return 'No path'
      if (!existsSync(path)) return `${path} does not exist`
      return shell.openPath(path)
    }),
  )

  ipcMain.handle(
    IPC.SHOW_ITEM_IN_FOLDER,
    guard((event, path) => {
      if (typeof path !== 'string' || !existsSync(path)) return false
      shell.showItemInFolder(path)
      return true
    }),
  )

  // Auto-update (app/main/updater). The updater starts a few seconds after launch.
  const notRunning = { ok: false, reason: 'not-running', message: 'The updater has not started yet.' }
  const withUpdater = (fn, fallback) => guard(() => (getUpdater() ? fn(getUpdater()) : fallback))
  ipcMain.handle(
    IPC.UPDATES_STATUS,
    withUpdater((updater) => updater.status(), null),
  )
  ipcMain.handle(
    IPC.UPDATES_CHECK,
    withUpdater((updater) => updater.check({ manual: true }), null),
  )
  ipcMain.handle(
    IPC.UPDATES_DOWNLOAD,
    withUpdater((updater) => updater.download(), null),
  )
  ipcMain.handle(
    IPC.UPDATES_QUIT_AND_INSTALL,
    withUpdater((updater) => updater.quitAndInstall(), notRunning),
  )

  ipcMain.on(IPC.LOG, (event, { level, message } = {}) => {
    const windowName = getWindowName(event.sender) || 'unknown'
    const logFn = level === 'error' ? log.error : log.warn
    logFn(`[renderer:${windowName}]`, message)
  })
}
