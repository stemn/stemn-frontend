import { createStore, applyMiddleware, compose } from 'redux'
// import { persistState } from 'redux-devtools';
import thunk                    from 'redux-thunk'
import promise                  from 'redux-promise-middleware'
import createLogger             from 'redux-logger'
import { hashHistory }          from 'react-router'
import { routerMiddleware }     from 'react-router-redux'
import getRootReducerRenderer   from '../reducers/rootReducer.renderer.js'
import forwardToMain            from '../middleware/forwardToMain'
import forwardToRendererWindow  from '../middleware/forwardToRendererWindow'
import routerFix                from 'stemn-shared/misc/Router/Router.middleware.js'

export default function configureStore(initialState) {
  const middleware = [
    thunk,
    promise(),
    routerFix,
    forwardToMain,
    forwardToRendererWindow,
    routerMiddleware(hashHistory),
  ]

  // If we are in development || we have debug mode on
  if (process.env.NODE_ENV === 'development' || initialState.system.settings.debug) {
    middleware.push(createLogger({
      level: 'info',
      collapsed: true,
    }))
  }

  const enhanced = [applyMiddleware(...middleware)]

  enhanced.push(window.devToolsExtension ? window.devToolsExtension() : noop => noop)
  //    enhanced.push(persistState(
  //      window.location.href.match(
  //        /[?&]debug_session=([^&]+)\b/
  //      )
  //    ));

  const rootReducer = getRootReducerRenderer()
  const enhancer    = compose(...enhanced)
  const store       = createStore(rootReducer, initialState, enhancer)

  if (!process.env.NODE_ENV && module.hot) {
    module.hot.accept('../reducers/rootReducer.base.js', () => {
      store.replaceReducer(require('../reducers/rootReducer.base.js'))
    })
  }

  return store
}
