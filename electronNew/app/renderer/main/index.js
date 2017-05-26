import '../shared/init.js'
import React from 'react'
import { render } from 'react-dom'
import { hashHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import configureStore from '../../shared/store/configureStore.renderer.js'
import standardSetup from '../shared/standardSetup.js'
import { remote } from 'electron'
import Root from './Root'
import { getAppContainer, initHotReload } from '../shared/hotReload.utils'

// Get the DOM elements
const rootEl = document.getElementById('root')
const loadingEl = document.getElementById('loading')

// Hide the loading spinner
loadingEl.style.display = 'none'
rootEl.style.display = 'flex'

const initialState = JSON.parse(remote.getGlobal('stateStringified'))
const store = configureStore(initialState)
const history = syncHistoryWithStore(hashHistory, store)
standardSetup(store, 'main')

// Render
const root = <Root store={ store } history={ history } />
render(getAppContainer(root), rootEl)

// Initialise the hot-reload
initHotReload(rootEl, store, history, './Root')

