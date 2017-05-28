const path = require('path')
const webpack = require('webpack')
const DashboardPlugin = require('webpack-dashboard/plugin')
const config = require('../config/webpack.config.production')
const fs = require('fs')

const compiler = webpack(config)
compiler.apply(new DashboardPlugin())

compiler.run((err, stats) => {
  fs.writeFileSync(path.join(__dirname, '../reports/stats.json'), JSON.stringify(stats.toJson()))
  console.log('stats.json created. Use https://webpack.github.io/analyse to preview.')
  process.exit()
})
