/**
 * Preload script for every Stemn window (sandboxed, context isolated).
 *
 * Exposes a small, explicit API as `window.stemnDesktop` instead of `electron.remote`
 * / node integration. Each function maps to one IPC channel handled in app/main/ipc.js.
 */
import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from '../shared/ipc/channels.js'
import { toIpcSafe } from '../shared/ipc/serialize.js'
import type { IStemnDesktopBridge } from './types'

const windowCommand = (command: string) => ipcRenderer.invoke(IPC.WINDOW_COMMAND, { command })

const bridge: IStemnDesktopBridge = {
  platform: process.platform as IStemnDesktopBridge['platform'],
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },
  getInitialState: () => ipcRenderer.invoke(IPC.GET_INITIAL_STATE),
  dispatchToMain: action => ipcRenderer.send(IPC.REDUX_ACTION, toIpcSafe(action)),
  forwardToWindow: (target, action) => ipcRenderer.send(IPC.FORWARD_TO_WINDOW, { target, action: toIpcSafe(action) }),
  onAction: (listener) => {
    const handler = (_event: unknown, action: any) => listener(action)
    ipcRenderer.on(IPC.REDUX_ACTION, handler)
    return () => { ipcRenderer.removeListener(IPC.REDUX_ACTION, handler) }
  },
  window: {
    minimize: () => windowCommand('minimize'),
    toggleMaximize: () => windowCommand('toggleMaximize'),
    close: () => windowCommand('close'),
    isMaximized: () => windowCommand('isMaximized'),
  },
  dialog: {
    selectDirectory: options => ipcRenderer.invoke(IPC.SELECT_DIRECTORY, options || {}),
  },
  shell: {
    openExternal: url => ipcRenderer.invoke(IPC.OPEN_EXTERNAL, url),
    openPath: path => ipcRenderer.invoke(IPC.OPEN_PATH, path),
    showItemInFolder: path => ipcRenderer.invoke(IPC.SHOW_ITEM_IN_FOLDER, path),
  },
  log: (level, message) => ipcRenderer.send(IPC.LOG, { level, message: String(message) }),
}

contextBridge.exposeInMainWorld('stemnDesktop', bridge)
