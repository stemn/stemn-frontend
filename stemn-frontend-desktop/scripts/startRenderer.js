// Creates a hot reloading development environment
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const DashboardPlugin = require('webpack-dashboard/plugin')
const config = require('../config/webpack.config.renderer.development')

const app = express()
const compiler = webpack(config)

// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin())

const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 3001

const log = (...args) => {
  args[0] = `\nWebpack: ${args[0]}`
  console.log(...args)
}

app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true,
    chunkModules: true,
  },
  historyApiFallback: true,
}))

app.use(webpackHotMiddleware(compiler))

app.listen(port, host, (err) => {
  if (err) {
    log(err)
    return
  }

  log('🚧  App is listening at http://%s:%s', host, port)
})
