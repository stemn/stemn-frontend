import Express from 'express'
import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import configureStore from '../client/app/store/configureStore'

const app = Express()
const port = 3000

const renderFullPage = (html, preloadedState) => { 

}

const handleRender = (req, res) => {
  // Create a new Redux store instance
  const store = configureStore({})

  // Render the component to a string
  const html = renderToString(
    <Provider store={ store }>
      <div>
        Here we are
      </div>
    </Provider>,
  )

  // Grab the initial state from our Redux store
  const preloadedState = store.getState()

  // Send the rendered page back to the client
  res.send(renderFullPage(html, preloadedState))
}

app.use('/static', Express.static('static'))
app.use(handleRender)
app.listen(port)