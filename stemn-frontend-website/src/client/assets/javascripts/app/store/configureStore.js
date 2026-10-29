import { setAutoFreeze } from 'immer'
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

const isDev = process.env.NODE_ENV !== 'production'

// Reducers use immer: freeze the state in development only (matching the previous immutability library)
setAutoFreeze(isDev)
// The redux logger runs in development, and in production with the ?debug search param
const debug = isDev || new URLSearchParams(window.location.search).has('debug')

const middleware = [
  thunk,
  auth,
  throttle,
  httpPackage,
  httpTransform,
  websocket,
  promise,
  toastsError,
  ...(debug ? [createLogger({ collapsed: true })] : []),
  routerMiddleware(),
  // redux-persist keeps a mutable `register` on its actions
  ...(isDev ? [immutableStateInvariant({ ignore: ['_persist'] })] : []),
]

const composeEnhancers = (isDev && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose

export default function configureStore(initialState) {
  const store = createStore(
    persistReducer(persistConfig, rootReducer),
    initialState,
    composeEnhancers(applyMiddleware(...middleware)),
  )

  // Hot module replacement for reducers (Vite dev server)
  if (import.meta.hot) {
    import.meta.hot.accept('../reducer', (nextModule) => {
      if (nextModule) store.replaceReducer(persistReducer(persistConfig, nextModule.default))
    })
  }

  return store
}
