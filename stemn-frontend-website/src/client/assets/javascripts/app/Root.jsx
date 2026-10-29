import React from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import { HelmetProvider } from 'react-helmet-async'
import { IconContext } from 'react-icons'

// react-icons v2 rendered every icon with vertical-align: middle
const iconContext = { style: { verticalAlign: 'middle' } }

const Root = ({ store, router }) => (
  <Provider store={store}>
    <HelmetProvider>
      <IconContext value={iconContext}>
        <RouterProvider router={router} />
      </IconContext>
    </HelmetProvider>
  </Provider>
)

export default Root
