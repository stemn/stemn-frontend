const merge = require('webpack-merge')
const webpack = require('webpack')
const config = require('./webpack.config.base')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const getStemnEnv = require('./getStemnEnv')

const GLOBALS = {
  'process.env': {
    NODE_ENV: JSON.stringify('development'),
  },
  GLOBAL_ENV: Object.assign({
    APP_TYPE: JSON.stringify('web'),
    NODE_ENV: JSON.stringify('development'),
  }, getStemnEnv(process.env.STEMN_ENV)),
}

module.exports = merge(config, {
  devtool: 'cheap-module-source-map',
  entry: {
    application: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      'development',
    ],
    vendor: ['react', 'react-dom', 'react-redux', 'react-router', 'react-router-redux', 'redux'],
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../build/client'),
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../src/client/assets/images'),
        to: 'images',
      }, {
        from: path.join(__dirname, '../src/client/assets/static'),
        to: 'static',
      },
    ]),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
    }),
  ],
  module: {
    loaders: [
      // Globals
      {
        test: /\.(css|scss)$/,
        include: [
          path.resolve(__dirname, '../src/client/assets/styles/global'),
        ],
        loaders: [
          'style',
          'css',
          'postcss',
          { loader: 'sass', query: { outputStyle: 'expanded' } },
        ],
      },
      // CSS Modules
      {
        test: /\.(css|scss)$/,
        include: [
          path.resolve(__dirname, '../src/client/assets/javascripts'),
          path.resolve(__dirname, '../src/client/assets/styles/modules'),
          path.resolve(__dirname, '../../stemn-frontend-shared'),
        ],
        loaders: [
          'style',
          {
            loader: 'css',
            query: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]_[local]-[hash:base64:5]',
            },
          },
          'postcss',
          {
            loader: 'sass',
            query: {
              outputStyle: 'expanded',
            },
          },
        ],
      },
    ],
  },
})
