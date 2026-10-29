/**
 * Boots a renderer window:
 *  1. fetches the main-process store state through the preload bridge
 *  2. creates the renderer store replica and replays the main-process actions into it
 *  3. creates a hash router (the windows are file:// pages) synced with the store
 *  4. renders with the React 19 root API
 */
import './init.js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createHashRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { IconContext } from 'react-icons'
import { syncRouterWithStore } from 'stemn-shared/routing'
import { getBridge } from 'stemn-shared/desktop/bridge'
import { loadUserData } from 'stemn-shared/misc/Auth/Auth.actions.js'
import initHttp from '../../shared/http/initHttp.js'
import configureStore from '../../shared/store/configureStore.renderer.js'

// react-icons v2 rendered every icon with vertical-align: middle
const iconContext = { style: { verticalAlign: 'middle' } }

const describe = (error) => {
  if (error && error.isAxiosError) {
    return `API request failed: ${error.config && error.config.method} ${error.config && error.config.url} - ${error.message}`
  }
  return error && error.stack ? error.stack : String(error)
}

const reportErrorsToMain = (bridge) => {
  window.addEventListener('error', (event) => {
    bridge.log('error', `Uncaught: ${describe(event.error || event.message)}`)
  })
  // API failures surface as rejected redux-promise-middleware promises that callers
  // often don't catch. The rejected actions are already in the store (and toasted),
  // so just log them instead of reporting uncaught exceptions.
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason
    if (reason && reason.isAxiosError) {
      event.preventDefault()
      console.warn(describe(reason))
      return
    }
    bridge.log('error', `Unhandled rejection: ${describe(reason)}`)
  })
}

/** Sentry is optional: loaded only when SENTRY_DSN was set at build time (same as the website) */
const initSentry = () => {
  if (!GLOBAL_ENV.SENTRY_DSN) return
  import('@sentry/browser')
    .then(Sentry => Sentry.init({ dsn: GLOBAL_ENV.SENTRY_DSN, environment: GLOBAL_ENV.NODE_ENV, release: `stemn-desktop@${GLOBAL_ENV.APP_VERSION}` }))
    .catch(err => console.error('Failed to load Sentry', err))
}

/**
 * @param {object} options
 * @param {(store) => object[]} options.createRoutes route objects for createHashRouter
 * @param {boolean} [options.loadUser] reload the user data on start (main window only)
 */
export default async function bootstrap({ createRoutes, loadUser = false }) {
  const bridge = getBridge()
  reportErrorsToMain(bridge)
  initSentry()

  const { state, windowName } = await bridge.getInitialState()
  const store = configureStore(state, { windowName })
  initHttp(() => store.getState().auth.authToken)

  // Actions reduced by the main-process store are replayed here
  bridge.onAction(action => store.dispatch(action))

  const router = createHashRouter(createRoutes(store))
  syncRouterWithStore(router, store)

  if (loadUser && store.getState().auth.authToken) {
    setTimeout(() => store.dispatch(loadUserData()), 1)
  }

  createRoot(document.getElementById('root')).render(
    <Provider store={ store }>
      <IconContext.Provider value={ iconContext }>
        <RouterProvider router={ router } />
      </IconContext.Provider>
    </Provider>,
  )

  // Handy for debugging and the e2e tests
  window.__STEMN__ = { store, router, windowName }
  return { store, router }
}
