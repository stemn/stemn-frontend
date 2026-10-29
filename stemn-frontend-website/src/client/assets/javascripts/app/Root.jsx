import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import { HelmetProvider } from 'react-helmet-async'
import { IconContext } from 'react-icons'

// react-icons v2 rendered every icon with vertical-align: middle
const iconContext = { style: { verticalAlign: 'middle' } }

const Root = ({ store, router }) => (
  <Provider store={store}>
    <HelmetProvider>
      <IconContext.Provider value={iconContext}>
        <RouterProvider router={router} />
      </IconContext.Provider>
    </HelmetProvider>
  </Provider>
)

Root.propTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
}

export default Root
