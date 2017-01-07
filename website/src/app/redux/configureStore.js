import { createStore, applyMiddleware, compose } from 'redux';
import thunk         from 'redux-thunk';
import promise       from 'redux-promise-middleware';
import createLogger  from 'redux-logger';
import rootReducer   from './reducers.js';

import throttle      from 'shared/redux/middleware/throttle/throttle.middleware.js';
import httpPackage   from 'shared/redux/middleware/httpPackage/httpPackage.middleware.js';
import httpTransform from 'shared/redux/middleware/httpTransform/httpTransform.middleware.js';

export default function configureStore(initialState) {
  console.log('Configure Store');
  const middleware = [
    thunk,
    throttle,
    httpPackage,
//    websocket,
    httpTransform,
    promise(),
  ];


  if(GLOBAL_ENV.ENV_TYPE == 'development') {
     middleware.push(createLogger({
      level: 'info',
      collapsed: true,
    }));
  }

  const enhanced    = [applyMiddleware(...middleware)];
  const enhancer    = compose(...enhanced);
  const store       = createStore(rootReducer, initialState, enhancer);

  return store;
}
