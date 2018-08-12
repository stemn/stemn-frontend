const merge = require('webpack-merge')
const webpack = require('webpack')
const config = require('./webpack.config.base')
const path = require('path')
const getStemnEnv = require('./getStemnEnv')

const GLOBALS = {
  GLOBAL_ENV: {
    APP_THREAD: JSON.stringify('electron'),
    APP_TYPE: JSON.stringify('desktop'),
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    ...getStemnEnv(process.env.STEMN_ENV),
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
