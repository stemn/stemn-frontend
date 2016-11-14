import '../shared/init.js';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from '../../shared/store/configureStore.renderer.js';
import getRoutes from './routes';
import pify from 'pify';
import electronJsonStorage from 'electron-json-storage';
const jsonStorage = pify(electronJsonStorage);
import standardSetup from '../shared/standardSetup.js'

async function start() {
  const initialState = await jsonStorage.get('sessionState');
  const store        = configureStore(initialState);
  const history      = syncHistoryWithStore(hashHistory, store);
  standardSetup(store);
  
  render(
    <Provider store={store}>
      <Router history={history} routes={getRoutes(store)} />
    </Provider>,
    document.getElementById('root')
  )
}

start();