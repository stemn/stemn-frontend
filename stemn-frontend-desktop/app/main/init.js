/**
 * First module of the main process: profile dir, logging, crash handlers and the axios defaults.
 */
import { app, dialog } from 'electron'
import log from 'electron-log/main'
import initHttp from '../shared/http/initHttp.js'
import { getAuthToken } from './storeRef.js'

// Tests and multiple dev instances can use their own profile directory
if (process.env.STEMN_USER_DATA_DIR) {
  app.setPath('userData', process.env.STEMN_USER_DATA_DIR)
}

log.initialize()

const describe = (error) => {
  if (error && error.isAxiosError) {
    return `API request failed: ${error.config && error.config.method} ${error.config && error.config.url} - ${error.message}`
  }
  return error && error.stack ? error.stack : String(error)
}

process.on('uncaughtException', (error) => {
  log.error('Uncaught exception in the main process:', describe(error))
  if (app.isReady() && !process.env.STEMN_E2E) {
    dialog.showErrorBox('An error occured in the main process', describe(error))
  }
})

// API failures surface as rejected redux-promise-middleware promises that callers
// often don't catch. The rejected actions are already in the store (and toasted).
process.on('unhandledRejection', (reason) => {
  log.warn('Unhandled rejection in the main process:', describe(reason))
})

initHttp(getAuthToken)
