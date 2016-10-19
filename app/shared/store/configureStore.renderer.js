import { createStore, applyMiddleware, compose } from 'redux';
//import { persistState } from 'redux-devtools';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import createLogger from 'redux-logger';
import { hashHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import getRootReducer from '../reducers';
import forwardToMain from './middleware/forwardToMain';
import forwardToRendererWindow from './middleware/forwardToRendererWindow';
import routerFix from './middleware/routerFix';

export default function configureStore(initialState) {
  const scope = 'renderer';
  const middleware =[
    thunk,
    promise(),
    routerFix,
    forwardToMain,
    forwardToRendererWindow,
    routerMiddleware(hashHistory),
  ];
  if(process.env.NODE_ENV == 'development') {
     middleware.push(createLogger({
      level: scope === 'main' ? undefined : 'info',
      collapsed: true,
    }));
  }

  const enhanced = [applyMiddleware(...middleware)];

  enhanced.push(window.devToolsExtension ? window.devToolsExtension() : noop => noop);
//    enhanced.push(persistState(
//      window.location.href.match(
//        /[?&]debug_session=([^&]+)\b/
//      )
//    ));


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
