import React from 'react'

export const getAppContainer = (rootApp) => {
  if (process.env.NODE_ENV !== 'production') {
    const AppContainer = require('react-hot-loader').AppContainer
    return (
      <AppContainer>
        { rootApp }
      </AppContainer>
    )
  }
  return rootApp
}

export const initHotReload = (rootEl, store, history, modulePath) => {
  // Setup hot-reload
  if (module.hot && process.env.NODE_ENV !== 'production') {
    /**
     * Warning from React Router, caused by react-hot-loader.
     * The warning can be safely ignored, so filter it from the console.
     * Otherwise you'll see it every time something changes.
     * See https://github.com/gaearon/react-hot-loader/issues/298
     */
    const orgError = console.error // eslint-disable-line no-console
    console.error = (message) => { // eslint-disable-line no-console
      if (message && message.indexOf('You cannot change <Router routes>;') === -1) {
        // Log the error as normally
        orgError.apply(console, [message])
      }
    }

    module.hot.accept(modulePath, () => {
      // If you use Webpack 2 in ES modules mode, you can
      // use <App /> here rather than require() a <NextApp />.
      const NextApp = require(modulePath).default
      const nextRoot = <NextApp store={ store } history={ history } />
      render(getAppContainer(nextRoot), rootEl)
    })
  }
}
