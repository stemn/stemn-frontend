import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducer';

import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import throttle from 'stemn-shared/redux/middleware/throttle/throttle.middleware.js'
import httpPackage from 'stemn-shared/redux/middleware/httpPackage/httpPackage.middleware.js'
import httpTransform from 'stemn-shared/redux/middleware/httpTransform/httpTransform.middleware.js'
import toastsError from 'stemn-shared/misc/Toasts/ToastsError.middleware'
//import createLogger from 'redux-logger'

const middleware = [
  thunk,
  throttle,
  httpPackage,
  httpTransform,
  promise(),
  toastsError,
//  createLogger({collapsed: true}),
]

const enhancer = compose(
  applyMiddleware(...middleware)
)(createStore)

export default function configureStore(initialState) {
  const store = enhancer(rootReducer, initialState)
  return store
}
