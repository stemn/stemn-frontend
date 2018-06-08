import Express from 'express'
import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import configureStore from '../client/app/store/configureStore'
import routes from '../client/pages/routes.ssr'

const app = Express()
const port = 3000

const getRouteType = (error, redirectLocation, renderProps) => {
  if (error) {
    return 'error'
  } else if (redirectLocation) {
    return 'redirect'
  } else if (renderProps) {
    return 'prerender'
  }
  return 'missing'
}

const renderFullPage = (renderProps) => {
  const store = configureStore()

  // Render the component to a string
  const html = renderToString(
    <Provider store={ store }>
      <RouterContext { ...renderProps } />
    </Provider>,
  )

  console.log(html)

  // const preloadedState = store.getState()

  return html
}

const handleRender = (req, res) => {
  match({ routes: routes(), location: req.url }, (error, redirect, renderProps) => {
    switch (getRouteType(error, redirect, renderProps)) {
      case 'error':
        return res.status(500).send(error)
      case 'prerender':
        return res.status(200).send(renderFullPage(renderProps))
      case 'redirect':
        return res.redirect(302, redirect.pathname + redirect.search)
      default:
        return res.status(200).send(renderFullPage(renderProps))
    }
  })
}

app.use('/static', Express.static('static'))
app.use(handleRender)
app.listen(port)