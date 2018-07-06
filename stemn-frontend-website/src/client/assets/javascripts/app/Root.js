import React from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import routes from '../pages/routes'
import PropTypes from 'prop-types'

const Root = ({ store, history }) => (
  <Provider store={ store }>
    <Router history={ history } routes={ routes(store) } />
  </Provider>
)

Root.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

export default Root
