/**
 * Replaces stemn-frontend-desktop/app/main/ipc.js in the core window (same exports).
 *
 * Electron                                 Tauri
 *   ipcMain.on(REDUX_ACTION)                 `stemn:to-core` { kind: 'action' }      -> store.dispatch
 *   ipcMain.on(FORWARD_TO_WINDOW)            `stemn:to-core` { kind: 'forward' }     -> sendToWindow
 *   ipcMain.handle(GET_INITIAL_STATE)        `stemn:to-core` { kind: 'get-initial-state' } -> core_send
 *   webContents.send(REDUX_ACTION)           core_broadcast (every renderer window filters on `target`)
 * The other preload channels (window commands, dialogs, shell, log) are Rust commands.
 */
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import log from 'electron-log/main'
import { WINDOW_NAMES } from 'stemn-frontend-desktop/app/shared/ipc/channels.js'
import { toIpcSafe } from 'stemn-frontend-desktop/app/shared/ipc/serialize.js'
import { createSequencer, type Sequencer } from '../shared/sequencer'
import type { ToCore } from '../shared/types'

export const coreSession =
  typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
let seq = 0

const scopeLocal = (action: any) => ({ ...action, meta: { ...action.meta, scope: 'local' } })

const broadcast = (action: any, target?: string) => {
  const payload = { kind: 'action', seq: ++seq, session: coreSession, action: toIpcSafe(scopeLocal(action)), target }
  invoke('core_broadcast', { payload }).catch((error) =>
    log.warn('Could not send an action to the windows:', String(error)),
  )
}

/** Send an action straight to the renderer store(s) of a named window */
export const sendToWindow = (name: string, action: any) => broadcast(action, name)

/** Send an action to the renderer stores of every window */
export const sendToAllWindows = (action: any) => broadcast(action)

const handle = (getStore: () => any, message: ToCore) => {
  if (message.kind === 'action') {
    const { action } = message
    if (action && typeof action.type === 'string') getStore().dispatch(action)
  } else if (message.kind === 'forward') {
    const { target, action } = message
    if (WINDOW_NAMES.includes(target) && action && typeof action.type === 'string') sendToWindow(target, action)
  } else if (message.kind === 'get-initial-state') {
    const payload = {
      kind: 'initial-state',
      id: message.id,
      state: toIpcSafe(getStore().getState()),
      session: coreSession,
      // the state contains every action numbered up to here
      after: seq,
    }
    invoke('core_send', { label: message.from, payload }).catch((error) =>
      log.warn(`Could not send the initial state to ${message.from}:`, String(error)),
    )
  }
}

export const registerIpcHandlers = ({ getStore }: { getStore: () => any }) => {
  // one ordered channel per sender window (Rust sets `from`, the window label)
  const senders = new Map<string, Sequencer<ToCore>>()
  return getCurrentWebviewWindow().listen<ToCore>('stemn:to-core', ({ payload }) => {
    if (!payload || typeof payload.from !== 'string') return
    let sequencer = senders.get(payload.from)
    if (!sequencer) {
      const from = payload.from
      sequencer = createSequencer<ToCore>({
        deliver: (message) => handle(getStore, message),
        onGap: (missing) => log.warn(`Messages ${missing.join(', ')} from ${from} are late`),
      })
      senders.set(payload.from, sequencer)
    }
    sequencer.push(payload)
  })
}
