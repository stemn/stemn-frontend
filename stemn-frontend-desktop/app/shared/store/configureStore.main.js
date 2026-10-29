import { setAutoFreeze } from 'immer'
import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import { thunk } from 'redux-thunk'
import promise from 'redux-promise-middleware'
import getRootReducerMain from '../reducers/rootReducer.main.js'
import forwardToRenderer from '../middleware/forwardToRenderer'
import toastsError from 'stemn-shared/misc/Toasts/ToastsError.middleware'
import autoLaunch from 'stemn-shared/desktop/AutoLaunch/AutoLaunch.middleware.js'
import functionLibrary from 'stemn-shared/misc/FunctionLibrary/FunctionLibrary.middleware.js'
import websocket from 'stemn-shared/misc/Websocket/websocket.middleware'
import throttle from 'stemn-shared/redux/middleware/throttle/throttle.middleware.js'
import httpTransform from 'stemn-shared/redux/middleware/httpTransform/httpTransform.middleware.js'
import httpPackage from 'stemn-shared/redux/middleware/httpPackage/httpPackage.middleware.js'

// Reducers use immer: freeze the state in development only (matching the previous immutability library)
setAutoFreeze(process.env.NODE_ENV !== 'production')

/**
 * The main-process store is the source of truth. Renderers forward their actions
 * here (forwardToMain) and every reduced action is replayed in all windows
 * (forwardToRenderer).
 */
export default function configureStore(initialState) {
  const middleware = [
    thunk,
    functionLibrary,
    throttle,
    httpPackage,
    httpTransform,
    websocket,
    promise,
    autoLaunch,
    toastsError,
    forwardToRenderer,
  ]

  return createStore(getRootReducerMain(), initialState, applyMiddleware(...middleware))
}
