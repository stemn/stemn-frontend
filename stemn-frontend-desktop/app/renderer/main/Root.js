import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import getRoutes from './routes'

const Root = ({ store, history }) => (
  <Provider store={ store }>
    <div className="layout-column flex">
      <Router history={ history }>
        { getRoutes(store) }
      </Router>
    </div>
  </Provider>
)

Root.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

export default Root
