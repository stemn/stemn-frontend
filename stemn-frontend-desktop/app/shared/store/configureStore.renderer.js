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
import { createQueryMiddleware } from 'stemn-shared/api/query/invalidation'
import { legacyInvalidations } from 'stemn-shared/api/query/legacyInvalidations'

// Reducers use immer: freeze the state in development only (matching the previous immutability library)
setAutoFreeze(process.env.NODE_ENV !== 'production')

/**
 * Renderer store: a replica of the main-process store (see forwardToMain).
 * `windowName` is this window's scope name: 'main' | 'menubar' | 'preview'.
 * `queryClient` is this window's TanStack Query client: the query middleware sits after forwardToMain,
 * so it sees the actions reduced here, including the ones the main process replays (websocket
 * invalidations, legacy writes, auth changes; see docs/API-CLIENT.md).
 */
export default function configureStore(initialState, { windowName, queryClient } = {}) {
  const middleware = [
    thunk,
    promise,
    routerFix,
    createForwardToRendererWindow(windowName),
    forwardToMain,
    ...(queryClient ? [createQueryMiddleware(queryClient, { legacyInvalidations })] : []),
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
