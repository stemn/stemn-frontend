import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import getRootReducerMain from '../reducers/rootReducer.main.js'
import forwardToRenderer from '../middleware/forwardToRenderer'
import toastsError from 'stemn-shared/misc/Toasts/ToastsError.middleware'
import autoLaunch from 'stemn-shared/desktop/AutoLaunch/AutoLaunch.middleware.js'
import functionLibrary from 'stemn-shared/misc/FunctionLibrary/FunctionLibrary.middleware.js'
import websocket from 'stemn-shared/misc/Websocket/websocket.middleware.js'
import throttle from 'stemn-shared/redux/middleware/throttle/throttle.middleware.js'
import httpTransform from 'stemn-shared/redux/middleware/httpTransform/httpTransform.middleware.js'
import httpPackage from 'stemn-shared/redux/middleware/httpPackage/httpPackage.middleware.js'

export default function configureStore(initialState) {
  const middleware = [
    thunk,
    functionLibrary,
    throttle,
    httpPackage,
    httpTransform,
    websocket,
    promise(),
    autoLaunch,
    toastsError,
    forwardToRenderer,
  ]

  const enhanced    = [applyMiddleware(...middleware)]
  const rootReducer = getRootReducerMain()
  const enhancer    = compose(...enhanced)
  const store       = createStore(rootReducer, initialState, enhancer)

  if (!process.env.NODE_ENV && module.hot) {
    module.hot.accept('../reducers/rootReducer.base.js', () => {
      store.replaceReducer(require('../reducers/rootReducer.base.js'))
    })
  }

  return store
}
