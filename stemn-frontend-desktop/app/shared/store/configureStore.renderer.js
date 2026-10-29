import { setAutoFreeze } from 'immer'
import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux'
import { thunk } from 'redux-thunk'
import promise from 'redux-promise-middleware'
import { createLogger } from 'redux-logger'
import { routerMiddleware } from 'stemn-shared/routing'
import routerFix from 'stemn-shared/misc/Router/Router.middleware.js'
import getRootReducerRenderer from '../reducers/rootReducer.renderer.js'
import forwardToMain from '../middleware/forwardToMain'
import createForwardToRendererWindow from '../middleware/forwardToRendererWindow'

// Reducers use immer: freeze the state in development only (matching the previous immutability library)
setAutoFreeze(process.env.NODE_ENV !== 'production')

/**
 * Renderer store: a replica of the main-process store (see forwardToMain).
 * `windowName` is this window's scope name: 'main' | 'menubar' | 'preview'.
 */
export default function configureStore(initialState, { windowName } = {}) {
  const middleware = [
    thunk,
    promise,
    routerFix,
    createForwardToRendererWindow(windowName),
    forwardToMain,
    routerMiddleware(),
  ]

  // Log actions in development or when debug mode is on
  const debug =
    initialState && initialState.system && initialState.system.settings && initialState.system.settings.debug
  if (process.env.NODE_ENV === 'development' || debug) {
    middleware.push(createLogger({ level: 'info', collapsed: true }))
  }

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  return createStore(getRootReducerRenderer(), initialState, composeEnhancers(applyMiddleware(...middleware)))
}
