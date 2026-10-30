import React from 'react'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router/dom'
import { HelmetProvider } from 'react-helmet-async'
import { IconContext } from 'react-icons'
import { QueryProvider } from 'stemn-shared/api/query/QueryProvider'

// react-icons v2 rendered every icon with vertical-align: middle
const iconContext = { style: { verticalAlign: 'middle' } }

const Root = ({ store, router, queryClient }) => (
  <Provider store={store}>
    <QueryProvider client={queryClient}>
      <HelmetProvider>
        <IconContext value={iconContext}>
          <RouterProvider router={router} />
        </IconContext>
      </HelmetProvider>
    </QueryProvider>
  </Provider>
)

export default Root
