import { createStore, applyMiddleware, compose } from 'redux'
import { persistState } from 'redux-devtools'

// Middleware
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import throttle from 'stemn-shared/redux/middleware/throttle/throttle.middleware.js'
import httpPackage from 'stemn-shared/redux/middleware/httpPackage/httpPackage.middleware.js'
import httpTransform from 'stemn-shared/redux/middleware/httpTransform/httpTransform.middleware.js'
import createLogger from 'redux-logger'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'


// Other
import rootReducer from '../reducer'
import DevTools from '../../modules/DevTools'

/**
 * Entirely optional.
 * This tiny library adds some functionality to your DevTools,
 * by logging actions/state to your console. Used in conjunction
 * with your standard DevTools monitor gives you great flexibility.
 */

const middlewares = [
  thunk,
  throttle,
  httpPackage,
  httpTransform,
  promise(),
  createLogger({collapsed: true}),
  routerMiddleware(browserHistory),
  require('redux-immutable-state-invariant')()
];

// By default we try to read the key from ?debug_session=<key> in the address bar
const getDebugSessionKey = function () {
  const matches = window.location.href.match(/[?&]debug_session=([^&]+)\b/);
  return (matches && matches.length) ? matches[1] : null;
};

const enhancer = compose(
  applyMiddleware(...middlewares),
  window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
  // Optional. Lets you write ?debug_session=<key> in address bar to persist debug sessions
  persistState(getDebugSessionKey()),
);

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);

  // Enable hot module replacement for reducers (requires Webpack or Browserify HMR to be enabled)
  if (module.hot) {
    module.hot.accept('../reducer', () => {
      const nextReducer = require('../reducer').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
