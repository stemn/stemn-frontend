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
import ReduxToastr from 'react-redux-toastr'

const initialState = remote.getGlobal('state');
const cloneState = invokeGetters(initialState);

const store = configureStore(cloneState, 'renderer');
const history = syncHistoryWithStore(hashHistory, store);

ipcRenderer.on('redux-action', (event, payload) => {
  store.dispatch(payload);
});

render(
  <Provider store={store}>
    <div>
      <Router history={history}>
        {getRoutes(store)}
      </Router>
      <ReduxToastr
        timeOut={4000}
        newestOnTop={true}
        position="bottom-center"/>
    </div>
  </Provider>,
  document.getElementById('root')
);


