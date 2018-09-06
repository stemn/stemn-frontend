import { createStore, applyMiddleware, compose } from 'redux'
import { persistState } from 'redux-devtools'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import throttle from 'stemn-shared/redux/middleware/throttle/throttle.middleware.js'
import httpPackage from 'stemn-shared/redux/middleware/httpPackage/httpPackage.middleware.js'
import httpTransform from 'stemn-shared/redux/middleware/httpTransform/httpTransform.middleware.js'
import createLogger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'
import toastsError from 'stemn-shared/misc/Toasts/ToastsError.middleware'
import auth from 'stemn-shared/misc/Auth/Auth.middleware'
import websocket from 'stemn-shared/misc/Websocket/websocket.middleware.js'
import rootReducer from '../reducer'
import { identity } from 'lodash'

const middlewares = [
  thunk,
  auth,
  throttle,
  httpPackage,
  httpTransform,
  websocket,
  promise(),
  toastsError,
  createLogger({ collapsed: true }),
  routerMiddleware(browserHistory),
  require('redux-immutable-state-invariant')(),
]

// By default we try to read the key from ?debug_session=<key> in the address bar
const getDebugSessionKey = function () {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/)
  return (matches && matches.length) ? matches[1] : null
}

const enhancer = compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : identity,
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey()),
)

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer)

  // Enable hot module replacement for reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducer', () => {
      const nextReducer = require('../reducer').default
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
