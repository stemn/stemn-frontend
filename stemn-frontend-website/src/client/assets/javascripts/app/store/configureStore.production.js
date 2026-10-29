import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import promise from 'redux-promise-middleware'
import { createLogger } from 'redux-logger'
import { persistReducer } from 'redux-persist'
import { routerMiddleware } from 'stemn-shared/routing'
import throttle from 'stemn-shared/redux/middleware/throttle/throttle.middleware.js'
import httpPackage from 'stemn-shared/redux/middleware/httpPackage/httpPackage.middleware.js'
import httpTransform from 'stemn-shared/redux/middleware/httpTransform/httpTransform.middleware.js'
import toastsError from 'stemn-shared/misc/Toasts/ToastsError.middleware'
import auth from 'stemn-shared/misc/Auth/Auth.middleware'
import websocket from 'stemn-shared/misc/Websocket/websocket.middleware.js'
import persistConfig from '../state/persistConfig'
import rootReducer from '../reducer'

const searchParams = new URLSearchParams(window.location.search)

const middleware = [
  thunk,
  auth,
  throttle,
  httpPackage,
  httpTransform,
  websocket,
  promise,
  toastsError,
  // If ?debug search param is used, the redux logger is added
  ...(searchParams.get('debug')
    ? [createLogger({ collapsed: true })]
    : []),
  routerMiddleware(),
]

export default function configureStore(initialState) {
  return createStore(
    persistReducer(persistConfig, rootReducer),
    initialState,
    applyMiddleware(...middleware),
  )
}
