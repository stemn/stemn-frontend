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
import standardSetup from '../shared/standardSetup.js';

const rootEl = document.getElementById('root');
const loadingEl = document.getElementById('loading');

const AppBase = React.createClass({
  componentDidMount: function() {
    loadingEl.style.display = 'none'
    rootEl.style.display    = 'flex';
  },
  render() {
    return this.props.children
  }
});

async function start() {
  const initialState = await jsonStorage.get('sessionState');
  const store        = configureStore(initialState);
  const history      = syncHistoryWithStore(hashHistory, store);
  standardSetup(store, 'main');

  render(
     <AppBase>
       <Provider store={store}>
        <div className="layout-column flex">
          <Router history={history}>
            {getRoutes(store)}
          </Router>
        </div>
      </Provider>
    </AppBase>,
    rootEl
  );
}
start();

