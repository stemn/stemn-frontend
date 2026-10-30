/**
 * `window.stemnDesktop` for the Tauri shell: the same API as the Electron preload script
 * (stemn-frontend-desktop/app/preload/index.ts, types in app/preload/types.ts), so the renderers
 * run unchanged. Bundled into one script (vite.bridge.config.ts) that Rust injects into every
 * renderer window as an initialization script, before the page's own scripts.
 *
 * Electron                         Tauri
 *   ipcRenderer.invoke/send          invoke('bridge_*') commands (allowed by capabilities/renderer.json)
 *   webContents.send (main -> win)   the `stemn:to-renderer` event of this window
 *   contextBridge (isolated world)   a frozen, non-configurable window property
 */
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import { toIpcSafe } from 'stemn-frontend-desktop/app/shared/ipc/serialize.js'
import type { IStemnDesktopBridge } from 'stemn-frontend-desktop/app/preload/types'
import { createSequencer } from '../shared/sequencer'
import type { ToRenderer } from '../shared/types'
import { installDragRegions } from './dragRegions'

const info = window.__STEMN_TAURI__
const windowName = info.windowName as 'main' | 'menubar' | 'preview'
const session = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
const INITIAL_STATE_TIMEOUT = 60_000

const quiet = (promise: Promise<unknown>) => {
  promise.catch(() => {})
}

// ------------------------------------------------------------------ renderer -> core
let outSeq = 0
const toCore = (message: Record<string, unknown>) =>
  invoke('bridge_to_core', { payload: { ...message, seq: ++outSeq, session } })

// ------------------------------------------------------------------ core -> renderer
const listeners = new Set<(action: any) => void>()
const queued: any[] = []
const sequencer = createSequencer<Extract<ToRenderer, { kind: 'action' }>>({
  onGap: (missing) => console.warn(`Stemn bridge: actions ${missing.join(', ')} from the core are late`),
  deliver: ({ action, target }) => {
    if (target && target !== windowName) return
    if (listeners.size === 0) queued.push(action)
    else listeners.forEach((listener) => listener(action))
  },
})
let snapshotTaken = false
const early: Extract<ToRenderer, { kind: 'action' }>[] = []
const stateRequests = new Map<string, (payload: Extract<ToRenderer, { kind: 'initial-state' }>) => void>()

const listening = getCurrentWebviewWindow().listen<ToRenderer>('stemn:to-renderer', ({ payload }) => {
  if (payload.kind === 'initial-state') {
    stateRequests.get(payload.id)?.(payload)
  } else if (payload.kind === 'action') {
    if (snapshotTaken) sequencer.push(payload)
    else early.push(payload)
  }
})

let requestCounter = 0
const getInitialState: IStemnDesktopBridge['getInitialState'] = async () => {
  await listening
  const id = `${session}-${++requestCounter}`
  return new Promise((resolve, reject) => {
    const started = Date.now()
    // the core window may still be loading: ask again until it answers
    const ask = () => quiet(toCore({ kind: 'get-initial-state', id }))
    const timer = setInterval(() => {
      if (Date.now() - started > INITIAL_STATE_TIMEOUT) {
        clearInterval(timer)
        stateRequests.delete(id)
        reject(new Error('The Stemn core window did not send the initial state'))
      } else {
        ask()
      }
    }, 500)
    stateRequests.set(id, (payload) => {
      clearInterval(timer)
      stateRequests.delete(id)
      if (!snapshotTaken) {
        snapshotTaken = true
        // everything up to `after` is in the snapshot
        sequencer.reset(payload.session, payload.after + 1)
        early.splice(0).forEach((message) => sequencer.push(message))
      }
      resolve({ state: payload.state, windowName })
    })
    ask()
  })
}

// ------------------------------------------------------------------ the bridge
const windowCommand = (command: string) => invoke<boolean>('bridge_window_command', { command })

const log: IStemnDesktopBridge['log'] = (level, message) =>
  quiet(invoke('bridge_log', { level, message: String(message) }))

const bridge: IStemnDesktopBridge = {
  platform: info.platform,
  versions: info.versions,
  getInitialState,
  dispatchToMain: (action) => quiet(toCore({ kind: 'action', action: toIpcSafe(action) })),
  forwardToWindow: (target, action) => quiet(toCore({ kind: 'forward', target, action: toIpcSafe(action) })),
  onAction: (listener) => {
    listeners.add(listener)
    queued.splice(0).forEach((action) => listener(action))
    return () => {
      listeners.delete(listener)
    }
  },
  window: {
    minimize: () => windowCommand('minimize'),
    toggleMaximize: () => windowCommand('toggleMaximize'),
    close: () => windowCommand('close'),
    isMaximized: () => windowCommand('isMaximized'),
  },
  dialog: {
    selectDirectory: (options) => invoke<string | null>('bridge_select_directory', { options: options || {} }),
  },
  shell: {
    openExternal: (url) => invoke<void>('bridge_open_external', { url }),
    openPath: (path) => invoke<string>('bridge_open_path', { path }),
    showItemInFolder: (path) => invoke<boolean>('bridge_show_item_in_folder', { path }),
  },
  log,
}

Object.defineProperty(window, 'stemnDesktop', {
  value: Object.freeze({
    ...bridge,
    window: Object.freeze(bridge.window),
    dialog: Object.freeze(bridge.dialog),
    shell: Object.freeze(bridge.shell),
    versions: Object.freeze({ ...bridge.versions }),
  }),
  writable: false,
  configurable: false,
  enumerable: true,
})

// Renderer console warnings/errors in the main log (Electron: webContents 'console-message',
// STEMN_LOG_RENDERER_CONSOLE=1, set by the e2e tests)
if (info.logRendererConsole) {
  const format = (args: unknown[]) =>
    args
      .map((arg) => (arg instanceof Error ? arg.stack || arg.message : typeof arg === 'string' ? arg : safeJson(arg)))
      .join(' ')
  const safeJson = (value: unknown) => {
    try {
      return JSON.stringify(value)
    } catch {
      return String(value)
    }
  }
  for (const level of ['warn', 'error'] as const) {
    const original = console[level].bind(console)
    console[level] = (...args: unknown[]) => {
      original(...args)
      quiet(invoke('bridge_log', { level, message: format(args), source: 'console' }))
    }
  }
}

installDragRegions(windowCommand)

// Electron: 'ready-to-show' (the main window is shown when its page is ready, previews always)
const ready = () => quiet(invoke('bridge_window_ready'))
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready, { once: true })
else ready()
