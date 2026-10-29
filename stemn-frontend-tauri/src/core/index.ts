/**
 * The core window: the JavaScript half of the Electron main process
 * (stemn-frontend-desktop/app/main/index.js `start()`), running in a hidden webview.
 *
 * It creates the same main-process redux store (configureStore.main.js, unchanged: FunctionLibrary,
 * websocket, auto-launch middleware, forwardToRenderer...), restores and persists its state,
 * answers the windows (getInitialState, their actions), connects the websocket and starts the
 * auto update. Node / Electron modules of the main process are swapped for Tauri versions at build
 * time (vite.core.config.ts `coreOverrides`); everything else is the Electron app's own code.
 */
import './init'

import { invoke } from '@tauri-apps/api/core'
import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow'
import log from 'electron-log/main'
import { initialise as initWebsocket } from 'stemn-shared/misc/Websocket/websocket.js'
import socketEventMap from 'stemn-shared/misc/Websocket/eventMap'
import AutoUpdateInit from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.init.js'
import { sendAuthToken } from 'stemn-shared/misc/Auth/Auth.actions.js'
import { downloadProgress } from 'stemn-shared/misc/Files/actions/downloadProgress'
import { push } from 'stemn-shared/routing/actions'
import configureStore from 'stemn-frontend-desktop/app/shared/store/configureStore.main.js'
import { getFilteredStoreData, jsonStorage } from 'stemn-frontend-desktop/app/main/json-storage.js'
import postStoreSetup from 'stemn-frontend-desktop/app/main/postStoreSetup.js'
import { getStore, setStore } from 'stemn-frontend-desktop/app/main/storeRef.js'
import { registerIpcHandlers, sendToWindow } from 'stemn-frontend-desktop/app/main/ipc.js'
import { setStorageDir } from './shims/electron-json-storage'

interface LaunchInfo {
  profileDir: string
  storageDir: string
  args: { hidden: boolean; path?: string | null; deepLink?: string | null }
  isDev: boolean
  version: string
}

const isLoggedIn = (state: any) => !!(state.auth.authToken && state.auth.user && state.auth.user._id)

async function start() {
  const launch = await invoke<LaunchInfo>('core_launch_info')
  log.info(
    `Stemn Desktop ${launch.version} core starting (STEMN_ENV=${GLOBAL_ENV.STEMN_ENV}, API ${GLOBAL_ENV.API_SERVER})`,
  )
  setStorageDir(launch.storageDir)
  invoke('core_configure', { config: { websiteUrl: GLOBAL_ENV.WEBSITE_URL } })

  // Fetch the persisted portion of the state
  const persistedState = await jsonStorage.get('state').catch((error: unknown) => {
    log.error('Invalid state store:', error)
    return jsonStorage.clear().then(() => ({}))
  })

  // Configure store
  const store = configureStore(persistedState || {})
  setStore(store)
  await registerIpcHandlers({ getStore })
  postStoreSetup(store)

  // Persist the store (debounced, writes are async)
  let saveTimeout: ReturnType<typeof setTimeout> | undefined
  store.subscribe(() => {
    clearTimeout(saveTimeout)
    saveTimeout = setTimeout(() => {
      jsonStorage
        .set('state', getFilteredStoreData(store.getState()))
        .catch((error: unknown) => log.error('Could not save the state:', error))
    }, 250)
  })

  // The tray's "Account Settings" item is enabled when signed in (createTrayIcon.js)
  let loggedIn = isLoggedIn(store.getState())
  invoke('tray_set_logged_in', { loggedIn })
  store.subscribe(() => {
    if (isLoggedIn(store.getState()) !== loggedIn) {
      loggedIn = !loggedIn
      invoke('tray_set_logged_in', { loggedIn })
    }
  })

  const core = getCurrentWebviewWindow()
  // OAuth callbacks from the local server (Rust, 127.0.0.1:49554): app/main/api/routes.js
  await core.listen<{ provider: string; code?: string }>('stemn:oauth-callback', ({ payload }) => {
    store.dispatch(sendAuthToken({ provider: payload.provider, code: payload.code }))
  })
  // Tray menu "Preferences" / "Account Settings"
  await core.listen<{ pathname: string }>('stemn:navigate-main', ({ payload }) => {
    sendToWindow('main', push({ pathname: payload.pathname }))
  })
  // FileSave.save progress (Rust save_file)
  await core.listen<{ fileUrl: string; progress: number }>('stemn:download-progress', ({ payload }) => {
    store.dispatch(downloadProgress(payload.fileUrl, payload.progress))
  })

  // Initialise the Websocket connection
  const websocket = initWebsocket(GLOBAL_ENV.WEBSOCKET_SERVER)
  websocket.on('open', () => log.info('Websocket connected to', GLOBAL_ENV.WEBSOCKET_SERVER))
  websocket.on('error', (error: any) => log.warn('Websocket error:', error && error.message))
  websocket.on('data', (action: any) => {
    if (window.__STEMN_TAURI__.logWebsocket || store.getState().system.settings.debug) {
      log.info('Websocket received', action && action.type)
    }
    socketEventMap(store, action)
  })

  // Initialise the auto-update after 5 seconds
  setTimeout(() => AutoUpdateInit(store), 5000)

  // Handy for debugging and the e2e tests
  ;(window as any).__STEMN__ = { store, windowName: 'core' }
}

start().catch((error) => {
  log.error('Startup error:', error && error.stack ? error.stack : String(error))
})
