import '../shared/init';
import { ipcRenderer, remote } from 'electron';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from '../../shared/store/configureStore';
import getRoutes from './routes';

const initialState = remote.getGlobal('state');

const store = configureStore(initialState, 'renderer');
const history = syncHistoryWithStore(hashHistory, store);

ipcRenderer.on('redux-action', (event, payload) => {
  store.dispatch(payload);
});

render(
  <Provider store={store}>
    <Router history={history}>
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('root')
);
