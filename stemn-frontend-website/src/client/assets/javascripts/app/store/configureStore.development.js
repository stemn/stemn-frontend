import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux'
import { thunk } from 'redux-thunk'
import promise from 'redux-promise-middleware'
import { createLogger } from 'redux-logger'
import immutableStateInvariant from 'redux-immutable-state-invariant'
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

const middlewares = [
  thunk,
  auth,
  throttle,
  httpPackage,
  httpTransform,
  websocket,
  promise,
  toastsError,
  createLogger({ collapsed: true }),
  routerMiddleware(),
  immutableStateInvariant({
    // redux-persist keeps a mutable `register` on its actions
    ignore: ['_persist'],
  }),
]

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default function configureStore(initialState) {
  const store = createStore(
    persistReducer(persistConfig, rootReducer),
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  )

  // Hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('../reducer', () => {
      const nextReducer = require('../reducer').default
      store.replaceReducer(persistReducer(persistConfig, nextReducer))
    })
  }

  return store
}
