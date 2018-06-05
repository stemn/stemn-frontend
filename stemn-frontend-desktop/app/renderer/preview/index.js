import '../shared/init.js'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router, hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from '../../shared/store/configureStore.renderer.js'
import getRoutes from './routes'
import standardSetup from '../shared/standardSetup.js'
import { remote } from 'electron'

function start() {
  const initialState = JSON.parse(remote.getGlobal('stateStringified'))
  const store        = configureStore(initialState)
  const history      = syncHistoryWithStore(hashHistory, store)
  standardSetup(store)
  
  render(
    <Provider store={ store }>
      <Router history={ history } routes={ getRoutes(store) } />
    </Provider>,
    document.getElementById('root'),
  )
}

start()
