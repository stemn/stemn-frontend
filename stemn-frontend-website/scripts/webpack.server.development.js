const webpack = require('webpack')
const DashboardPlugin = require('webpack-dashboard/plugin')
const config = require('../config/webpack.config.server.development')

const compiler = webpack(config)
compiler.apply(new DashboardPlugin())

compiler.run(() => {
  process.exit()
})
