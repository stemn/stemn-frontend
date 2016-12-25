import { createStore, applyMiddleware, compose } from 'redux';
import thunk         from 'redux-thunk';
import promise       from 'redux-promise-middleware';
import createLogger  from 'redux-logger';
import rootReducer   from './reducers.js';

export default function configureStore(initialState) {
  const middleware =[
    thunk,
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
