const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./webpack.config.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const HashModuleId = require('./plugins/HashModuleId')

const GLOBALS = {
//  'process.env': {
//    NODE_ENV: JSON.stringify('production'),
//  },
  GLOBAL_ENV: {
    API_SERVER: JSON.stringify(process.env.API_SERVER),
    APP_THREAD: JSON.stringify('renderer'),
    APP_TYPE: JSON.stringify('desktop'),
    ELECTRON_CRASH_REPORT_SERVER: JSON.stringify(process.env.ELECTRON_CRASH_REPORT_SERVER),
    NODE_ENV: JSON.stringify('production'),
    WEBSITE_URL: JSON.stringify('https://dev.stemn.com'),
    WEBSOCKET_SERVER: JSON.stringify(process.env.WEBSOCKET_SERVER),
  },
}

const chunkIncludes = targets => ({ context }) => context && context.indexOf('node_modules') >= 0 && targets.find(t => new RegExp('\\\\' + t + '\\\\', 'i').test(context))

module.exports = merge(config, {
  debug: false,
  devtool: 'cheap-module-source-map',
  entry: {
    main: path.resolve(__dirname, '../app/renderer/main/index'),
    menubar: path.resolve(__dirname, '../app/renderer/menubar/index'),
    preview: path.resolve(__dirname, '../app/renderer/preview/index'),
    vendor: ['react', 'react-dom', 'react-redux', 'react-router', 'react-router-redux', 'redux', 'lodash', 'moment'],
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../dist/renderer'),
    publicPath: '../../', // the path of the root dist relative to the html files (so the html can resolve relative resources)
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: false,
        drop_debugger: true,
        dead_code: true,
      },
      output: {
        comments: false,
      },
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../app/static'),
      to: 'static',
    }]),
    // Copy the package.json folder. This is used in electron-builder. Not sure why...
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../app/package.json'),
      to: path.join(__dirname, '../dist/package.json'),
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
    noParse: /\.min\.js$/,
    loaders: [{
      test: /\.global\.(css|scss)$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style',
        loader: [
          { loader: 'css', query: { sourceMap: true } },
          'postcss',
          { loader: 'sass', query: { outputStyle: 'compressed' } },
        ],
      }),
    }, {
      test: /^((?!\.global).)*\.(css|scss)$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style',
        loader: [
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
              outputStyle: 'compressed',
            },
          },
        ],
      }),
    },
    ],
  },
  target: 'electron-renderer',
})
