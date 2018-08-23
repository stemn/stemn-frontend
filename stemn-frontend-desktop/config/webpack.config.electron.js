const merge = require('webpack-merge')
const webpack = require('webpack')
const config = require('./webpack.config.base')
const path = require('path')
const getStemnEnv = require('./getStemnEnv')
const stringifyEnv = require('./utils/stringifyEnv')

const GLOBALS = {
  GLOBAL_ENV: stringifyEnv({
    APP_THREAD: 'electron',
    APP_TYPE: 'desktop',
    NODE_ENV: process.env.NODE_ENV,
    ...getStemnEnv(process.env.STEMN_ENV),
  }),
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
