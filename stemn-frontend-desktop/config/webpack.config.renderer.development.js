const merge = require('webpack-merge')
const webpack = require('webpack')
const config = require('./webpack.config.base')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const getStemnEnv = require('./getStemnEnv')
const stringifyEnv = require('./utils/stringifyEnv')

const {
  STEMN_ENV = 'staging',
  HOST = '0.0.0.0',
} = process.env;

const GLOBALS = {
  GLOBAL_ENV: stringifyEnv({    
    APP_THREAD: 'renderer',
    APP_TYPE: 'desktop',
    NODE_ENV: 'development',
    ...getStemnEnv(STEMN_ENV),
  }),
}

module.exports = merge(config, {
  debug: true,
  devtool: 'source-map',
  entry: {
    main: [
      `webpack-hot-middleware/client?path=http://${HOST}:3001/__webpack_hmr`,
      'react-hot-loader/patch',
      path.resolve(__dirname, '../app/renderer/main/index'),
    ],
    menubar: [
      `webpack-hot-middleware/client?path=http://${HOST}:3001/__webpack_hmr`,
      'react-hot-loader/patch',
      path.resolve(__dirname, '../app/renderer/menubar/index'),
    ],
    preview: [
      `webpack-hot-middleware/client?path=http://${HOST}:3001/__webpack_hmr`,
      'react-hot-loader/patch',
      path.resolve(__dirname, '../app/renderer/preview/index'),
    ],
    vendor: ['react', 'react-dom', 'react-redux', 'react-router', 'react-router-redux', 'redux'],
  },
  output: {
    filename: 'js/[name].js',
    publicPath: `http://${HOST}:3001/`,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../app/static'),
      to: 'static',
    }]),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['vendor', 'main', 'preview', 'menubar'],
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.global\.(css|scss)$/,
        loaders: [
          'style',
          'css',
          'postcss',
          { loader: 'sass', query: { outputStyle: 'expanded' } },
        ],
      },
      {
        test: /^((?!\.global).)*\.(css|scss)$/,
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
  target: 'electron-renderer',
})
