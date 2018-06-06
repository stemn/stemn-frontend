const webpack = require('webpack')
const DashboardPlugin = require('webpack-dashboard/plugin')
const config = require('../config/webpack.config.production')

const compiler = webpack(config)
compiler.apply(new DashboardPlugin())

compiler.run(() => {
  process.exit()
})
