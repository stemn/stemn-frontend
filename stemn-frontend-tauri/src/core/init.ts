/**
 * First module of the core window (stemn-frontend-desktop/app/main/init.js): crash handlers and
 * the axios defaults. Logging is tauri-plugin-log (electron-log shim); the profile folder is
 * chosen by Rust (STEMN_USER_DATA_DIR).
 */
import log from 'electron-log/main'
import initHttp from 'stemn-frontend-desktop/app/shared/http/initHttp.js'
import { getAuthToken } from 'stemn-frontend-desktop/app/main/storeRef.js'

const describe = (error: any) => {
  if (error && error.isAxiosError) {
    return `API request failed: ${error.config && error.config.method} ${error.config && error.config.url} - ${error.message}`
  }
  return error && error.stack ? error.stack : String(error)
}

window.addEventListener('error', (event) => {
  log.error('Uncaught exception in the main process:', describe(event.error || event.message))
})

// API failures surface as rejected redux-promise-middleware promises that callers often don't
// catch. The rejected actions are already in the store (and toasted).
window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault()
  log.warn('Unhandled rejection in the main process:', describe(event.reason))
})

// console warnings/errors of the core window in the main log (STEMN_LOG_RENDERER_CONSOLE, set by the e2e tests)
if (window.__STEMN_TAURI__.logRendererConsole) {
  for (const level of ['warn', 'error'] as const) {
    const original = console[level].bind(console)
    console[level] = (...args: unknown[]) => {
      original(...args)
      log[level === 'error' ? 'error' : 'warn']('[console:core]', ...args)
    }
  }
}

initHttp(getAuthToken)
