import { createStore, applyMiddleware, compose } from 'redux';
//import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import getRootReducer from '../reducers';

import forwardToMain from './middleware/forwardToMain';
import forwardToRenderer from './middleware/forwardToRenderer';
import forwardToRendererWindow from './middleware/forwardToRendererWindow';
import triggerAlias from './middleware/triggerAlias';
import routerFix from './middleware/routerFix';

export default function configureStore(initialState, scope = 'main') {
  const logger = createLogger({
    level: scope === 'main' ? undefined : 'info',
    collapsed: true,
  });
  const router = routerMiddleware(hashHistory);

  let middleware = [];


  if (scope === 'renderer') {
    middleware = [
      promise(),
      thunk,
      routerFix,
      forwardToMain,
      forwardToRendererWindow,
      router,
    ];
    if (process.env.NODE_ENV == 'development') {
       middleware.push(logger);
    }
  }

  if (scope === 'main') {
    middleware = [
      promise(),
      thunk,
      triggerAlias,
      forwardToRenderer,
    ];
  }
  const enhanced = [
    applyMiddleware(...middleware),
  ];

  if (/*! process.env.NODE_ENV && */scope === 'renderer') {
    enhanced.push(window.devToolsExtension ? window.devToolsExtension() : noop => noop);
//    enhanced.push(persistState(
//      window.location.href.match(
//        /[?&]debug_session=([^&]+)\b/
//      )
//    ));
  }

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
