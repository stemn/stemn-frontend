import '../shared/init';
import { ipcRenderer, remote } from 'electron';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from '../../shared/store/configureStore';
import invokeGetters from 'app/shared/helpers/invokeGetters.js'
import getRoutes from './routes';

const initialState = remote.getGlobal('state');
const cloneState = invokeGetters(initialState);

const store = configureStore(cloneState, 'renderer');
const history = syncHistoryWithStore(hashHistory, store);

ipcRenderer.on('redux-action', (event, payload) => {
  store.dispatch(payload);
});

render(
  <Provider store={store}>
    <Router history={history} routes={getRoutes(store)} />
  </Provider>,
  document.getElementById('root')
);
