import 'styles/global/index.global.scss'
import React from 'react'
import { render } from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './Root'
import configureStore from './store/configureStore'
import getInitialState from './state/getInitialState'
import persistConfig from './state/persistConfig'
import initHttp from './init/initHttp'
import initRaven from './init/initRaven'
import initAuth from './init/initAuth'
import initWebsocket from './init/initWebsocket'
import { createPersistor } from 'redux-persist'
import { getLatest } from 'stemn-shared/misc/DesktopReleases/DesktopReleases.actions'
import { getNotifications } from 'stemn-shared/misc/Notifications/Notifications.actions'

const initReactAndRedux = (initialState) => {
  const store = configureStore(initialState)
  createPersistor(store, persistConfig)
  const history = syncHistoryWithStore(browserHistory, store)

  // Init some libs
  initHttp(store)
  initRaven()
  initAuth(store)
  initWebsocket(store)

  // Get the latest desktop revisions
  store.dispatch(getLatest())

  // Get the notifications
  store.dispatch(getNotifications())
  setInterval(() => store.dispatch(getNotifications()), 60 * 1000)

  // Get the DOM Element that will host our React application
  const rootEl = document.getElementById('app')

  // Render the React application to the DOM'
  const root = <Root store={ store } history={ history } />

  // Render
  render(root, rootEl)

  // Get the spinner DOM Element
  const spinnerEl = document.getElementById('spinner')
  // Change the opacity to animate it out
  spinnerEl.style.opacity = 0
  // Remove it after 300ms (the transition time)
  setTimeout(() => spinnerEl.remove(), 300)
}

getInitialState(persistConfig)
  .then(initReactAndRedux)
