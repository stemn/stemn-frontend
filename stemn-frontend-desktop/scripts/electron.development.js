const webpack = require('webpack')
const DashboardPlugin = require('webpack-dashboard/plugin')
const config = require('../config/webpack.config.electron')

const compiler = webpack(config)
compiler.apply(new DashboardPlugin())

compiler.run((err, stats) => {
  console.log('Build complete');
//  process.exit()
})
