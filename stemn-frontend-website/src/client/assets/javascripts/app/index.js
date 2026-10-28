import 'styles/global/index.global.scss'
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
import { getNotifications } from 'stemn-shared/misc/Notifications/Notifications.actions'

const waitForRehydration = store => new Promise((resolve) => {
  persistStore(store, null, resolve)
})

const hideSpinner = () => {
  const spinnerEl = document.getElementById('spinner')
  if (!spinnerEl) return
  // Change the opacity to animate it out, then remove it after the transition time
  spinnerEl.style.opacity = 0
  setTimeout(() => spinnerEl.remove(), 300)
}

(async () => {
  const store = configureStore()
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

  // Get the notifications
  store.dispatch(getNotifications())
  setInterval(() => store.dispatch(getNotifications()), 60 * 1000)

  // Render react
  createRoot(document.getElementById('app')).render(<Root store={ store } router={ router } />)
  hideSpinner()
})()
