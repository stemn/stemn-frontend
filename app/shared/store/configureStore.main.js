import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import getRootReducer from '../reducers';

import forwardToRenderer from './middleware/forwardToRenderer';
import httpPackage from './middleware/httpPackage';
import transformHttp from './middleware/transformHttp';
import throttle from './middleware/throttle';
import errorToast from './middleware/errorToast';
import errorModal from './middleware/errorModal';
import electronWindows from '../modules/ElectronWindows/ElectronWindows.middleware.js';

export default function configureStore(initialState) {
  const scope = 'main';
  const middleware = [
    thunk,
    throttle,
    httpPackage,
    transformHttp,
    promise(),
    electronWindows,
    errorToast,
    errorModal,
    forwardToRenderer,
  ];

  const enhanced = [applyMiddleware(...middleware)];

  const rootReducer = getRootReducer(scope);
  const enhancer = compose(...enhanced);
  const store = createStore(rootReducer, initialState, enhancer);

  if (!process.env.NODE_ENV && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'));
    });
  }

  return store;
}
