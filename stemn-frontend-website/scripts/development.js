// Creates a hot reloading development environment
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const DashboardPlugin = require('webpack-dashboard/plugin')
const config = require('../config/webpack.config.development')

const app = express()
const compiler = webpack(config)

// Apply CLI dashboard for your webpack dev server
compiler.apply(new DashboardPlugin())

// compiler.plugin('done', (stats) => {
//  fs.writeFileSync('../reports/stats.json', JSON.stringify(stats.toJson()))
//  console.log('stats.json created. Use https://webpack.github.io/analyse to preview.')
// })

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 3000

function log(...args) {
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../src/client/assets/index.html'))
})

app.listen(port, host, (err) => {
  if (err) {
    log(err)
    return
  }

  log('🚧  App is listening at http://%s:%s', host, port)
})
