import { createStore, applyMiddleware, compose } from 'redux'
import rootReducer from '../reducer'
import qs from 'querystring'

import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import throttle from 'stemn-shared/redux/middleware/throttle/throttle.middleware.js'
import httpPackage from 'stemn-shared/redux/middleware/httpPackage/httpPackage.middleware.js'
import httpTransform from 'stemn-shared/redux/middleware/httpTransform/httpTransform.middleware.js'
import toastsError from 'stemn-shared/misc/Toasts/ToastsError.middleware'
import createLogger from 'redux-logger'
import auth from 'stemn-shared/misc/Auth/Auth.middleware'
import websocket from 'stemn-shared/misc/Websocket/websocket.middleware.js'

const searchParams = qs.parse(window.location.search.substring(1))

const middleware = [
  thunk,
  auth,
  throttle,
  httpPackage,
  httpTransform,
  websocket,
  promise(),
  toastsError,
  // If ?debug search param is used, the redux logger is added
  ...(searchParams.debug
    ? [createLogger({ collapsed: true })]
    : []),
  routerMiddleware(browserHistory),
]

const enhancer = compose(
  applyMiddleware(...middleware),
)(createStore)

export default function configureStore(initialState) {
  const store = enhancer(rootReducer, initialState)
  return store
}
