import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { AppContainer } from 'react-hot-loader';
import Redbox from 'redbox-react';

import Root from './Root';
import configureStore from './store/configureStore';
import getInitialState from './state/getInitialState';
import persistConfig from './state/persistConfig';
import initHttp from './init/initHttp';
import initRaven from './init/initRaven';
import initAuth from './init/initAuth';
import { createPersistor } from 'redux-persist';
import { getLatest } from 'stemn-shared/misc/DesktopReleases/DesktopReleases.actions'
import { getNotifications } from 'stemn-shared/misc/Notifications/Notifications.actions'

import 'styles/global/index.global.css';


const initReactAndRedux = (initialState) => {
  const store = configureStore(initialState)
  const persist = createPersistor(store, persistConfig)
  const history = syncHistoryWithStore(browserHistory, store)
  initHttp(store)
  initRaven()
  initAuth(store)
  
  // Dispatch some actions
  // Get the latest desktop revisions
  store.dispatch(getLatest())
  // Get the notifications
  store.dispatch(getNotifications())
  setInterval(() => store.dispatch(getNotifications()), 60*1000)

  // Get the DOM Element that will host our React application
  const rootEl = document.getElementById('app');

  // Render the React application to the DOM
  render(
    <AppContainer errorReporter={Redbox}>
      <Root store={store} history={history} />
    </AppContainer>,
    rootEl
  );
  
  if (module.hot && process.env.NODE_ENV !== 'production') {
    /**
     * Warning from React Router, caused by react-hot-loader.
     * The warning can be safely ignored, so filter it from the console.
     * Otherwise you'll see it every time something changes.
     * See https://github.com/gaearon/react-hot-loader/issues/298
     */
     const orgError = console.error; // eslint-disable-line no-console
     console.error = (message) => { // eslint-disable-line no-console
       if (message && message.indexOf('You cannot change <Router routes>;') === -1) {
         // Log the error as normally
         orgError.apply(console, [message]);
       }
     };

    module.hot.accept('./Root', () => {
      // If you use Webpack 2 in ES modules mode, you can
      // use <App /> here rather than require() a <NextApp />.
      const NextApp = require('./Root').default;

      render(
        <AppContainer errorReporter={Redbox}>
          <NextApp store={store} history={history} />
        </AppContainer>,
        rootEl
      );
    });
  }
};

getInitialState(persistConfig)
  .then(initReactAndRedux)
