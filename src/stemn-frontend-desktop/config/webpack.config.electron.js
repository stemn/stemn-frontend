const merge = require('webpack-merge')
const webpack = require('webpack')
const config = require('./webpack.config.base')
const path = require('path')

const GLOBALS = {
  GLOBAL_ENV: {
    API_SERVER: JSON.stringify(process.env.API_SERVER),
    APP_THREAD: JSON.stringify('electron'),
    APP_TYPE: JSON.stringify('desktop'),
    ELECTRON_CRASH_REPORT_SERVER: JSON.stringify(process.env.ELECTRON_CRASH_REPORT_SERVER),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    WEBSITE_URL: JSON.stringify('http://stemn.com'),
    WEBSOCKET_SERVER: JSON.stringify(process.env.WEBSOCKET_SERVER),
  },
}

module.exports = merge(config, {
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,
  entry: [
    path.resolve(__dirname, '../app/main/index'),
  ],
  output: {
    path: path.resolve(__dirname, '../dist/main'),
    filename: 'index.js',
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
  ],
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [
    'source-map-support',
  ],
})
