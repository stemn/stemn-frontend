const merge = require('webpack-merge')
const webpack = require('webpack')
const config = require('./webpack.config.base')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const GLOBALS = {
//  'process.env': {
//    NODE_ENV: JSON.stringify('production'),
//  },
  GLOBAL_ENV: {    
    API_SERVER: JSON.stringify(process.env.API_SERVER),
    APP_THREAD: JSON.stringify('renderer'),
    APP_TYPE: JSON.stringify('desktop'),
    ELECTRON_CRASH_REPORT_SERVER: JSON.stringify(process.env.ELECTRON_CRASH_REPORT_SERVER),
    NODE_ENV: JSON.stringify('development'),
    WEBSITE_URL: JSON.stringify('http://stemn.com'),
    WEBSOCKET_SERVER: JSON.stringify(process.env.WEBSOCKET_SERVER),
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'true')),
}

const chunkIncludes = (targets) => ({ context }) => {
  return context && context.indexOf('node_modules') >= 0 && targets.find(t => new RegExp('\\\\' + t + '\\\\', 'i').test(context))
}

module.exports = merge(config, {
  debug: true,
  devtool: 'source-map',
  entry: {
    main: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      path.resolve(__dirname, '../app/renderer/main/index'),
    ],
    menubar: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      path.resolve(__dirname, '../app/renderer/menubar/index'),
    ],
    preview: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      path.resolve(__dirname, '../app/renderer/preview/index'),
    ],
    vendor: ['react', 'react-dom', 'react-redux', 'react-router', 'react-router-redux', 'redux'],
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist/renderer'),
    publicPath: '/',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['vendor', 'main', 'preview', 'menubar'],
    }),
//    new webpack.optimize.CommonsChunkPlugin({
//      children: true,
//      async: true,
//      minChunks: (module, count) => count >= 6,
//    }),
//    new webpack.optimize.CommonsChunkPlugin({
//      children: true,
//      async: true,
//      minChunks: chunkIncludes(['codemirror']),
//    }),
//    new webpack.optimize.CommonsChunkPlugin({
//      name: 'commonPreview',
//      filename: 'js/commonPreview.js',
//      chunks: ['main', 'preview'],
//    }),    
//    new webpack.optimize.CommonsChunkPlugin({
//      name: 'common',
//      filename: 'js/common.js',
//      chunks: ['commonPreview', 'menubar'],
//    }),
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
