import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import getRootReducerMain from '../reducers/rootReducer.main.js';

import forwardToRenderer from './middleware/forwardToRenderer';
import httpPackage from './middleware/httpPackage';
import transformHttp from './middleware/transformHttp';
import throttle from './middleware/throttle';
import errorModalToast from './middleware/errorModalToast';
import electronWindows from '../modules/ElectronWindows/ElectronWindows.middleware.js';
import autoLaunch from '../modules/AutoLaunch/AutoLaunch.middleware.js';
import functionLibrary from '../modules/FunctionLibrary/FunctionLibrary.middleware.js';

export default function configureStore(initialState) {
  const middleware = [
    thunk,
    throttle,
    httpPackage,
    functionLibrary,
    transformHttp,
    promise(),
    electronWindows,
    autoLaunch,
    errorModalToast,
    forwardToRenderer,
  ];

  const enhanced    = [applyMiddleware(...middleware)];
  const rootReducer = getRootReducerMain();
  const enhancer    = compose(...enhanced);
  const store       = createStore(rootReducer, initialState, enhancer);

  if (!process.env.NODE_ENV && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  return store;
}
