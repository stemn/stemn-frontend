import '../../styles/global/index.global.scss'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { persistStore } from 'redux-persist'
import { syncRouterWithStore } from 'stemn-shared/routing'
import Root from './Root'
import configureStore from './store/configureStore'
import initHttp from './init/initHttp'
import initSentry from './init/initSentry'
import initAuth from './init/initAuth'
import initWebsocket from './init/initWebsocket'
import createRoutes from '../pages/routes'
import { initialise as initAnalytics } from '../modules/Analytics'
import { getLatest } from 'stemn-shared/misc/DesktopReleases/DesktopReleases.actions'
import { createStemnQueryClient, queryErrorAction } from 'stemn-shared/api/query/queryClient'
import { connectLegacyBridge } from 'stemn-shared/api/query/legacyBridge'
import { setQueryClient } from 'stemn-shared/api/query/registry'

const waitForRehydration = (store) =>
  new Promise((resolve) => {
    persistStore(store, null, resolve)
  })

const hideSpinner = () => {
  const spinnerEl = document.getElementById('spinner')
  if (!spinnerEl) return
  // Change the opacity to animate it out, then remove it after the transition time
  spinnerEl.style.opacity = 0
  setTimeout(() => spinnerEl.remove(), 300)
}

// API failures surface as rejected redux-promise-middleware promises that callers
// often don't catch. The rejected actions are already in the store (and toasted),
// so just log them instead of reporting uncaught exceptions.
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason
  if (reason && (reason.isAxiosError || reason.isApiError)) {
    event.preventDefault()
    console.warn(
      reason.isApiError
        ? `API request failed: ${reason.status} ${reason.url || ''} - ${reason.message}`
        : `API request failed: ${reason.config && reason.config.method} ${reason.config && reason.config.url} - ${reason.message}`,
    )
  }
})

;(async () => {
  // Server state lives in TanStack Query (docs/API-CLIENT.md); failures are toasted through Redux
  const queryClient = createStemnQueryClient({
    // Only called once a query runs, after the store exists
    onError: (error, context) => store.dispatch(queryErrorAction(error, context)),
  })
  const store = configureStore(undefined, { queryClient })
  setQueryClient(queryClient)
  connectLegacyBridge(queryClient, store.dispatch)
  // Wait for the persisted auth state (token + user) before anything reads it
  await waitForRehydration(store)

  const router = createBrowserRouter(createRoutes(store))
  syncRouterWithStore(router, store)

  // Init some libs
  initSentry()
  if (process.env.NODE_ENV === 'production') initAnalytics()
  initHttp(store)
  initAuth(store)
  initWebsocket(store)

  // Get the latest desktop revisions
  store.dispatch(getLatest())

  // Render react
  createRoot(document.getElementById('app')).render(<Root store={store} router={router} queryClient={queryClient} />)
  hideSpinner()
})()
