const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./webpack.config.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')

const GLOBALS = {
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
  GLOBAL_ENV: {
    APP_TYPE: JSON.stringify('web'),
    NODE_ENV: JSON.stringify('production'),
    WEBSITE_URL: JSON.stringify('https://stemn.com'),
    API_SERVER: JSON.stringify('https://stemn.com'),
    WEBSOCKET_SERVER: JSON.stringify('https://stemn.com:8443'),
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false')),
}

const chunkIncludes = targets => ({ context }) => context && context.indexOf('node_modules') >= 0 
  && targets.find(t => new RegExp(`\\\\${t}\\\\`, 'i').test(context))

module.exports = merge(config, {
  debug: false,
  devtool: 'cheap-module-source-map',
  entry: {
    application: 'client/',
    vendor: [
      'axios',
      'icepick',
      'moment',
      'react',
      'react-dom',
      'react-helmet',
      'react-popover',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-logger',
      'redux-persist',
    ],
  },
  output: {
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[id].[chunkhash].js',
    path: path.resolve(__dirname, '../build/client'),
    publicPath: '/',
  },
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
      },
      output: {
        comments: false,
      },
    }),
    new ExtractTextPlugin({
      filename: 'css/app.[chunkhash].css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../src/client/images'),
        to: 'images',
      }, {
        from: path.join(__dirname, '../src/client/static'),
        to: 'static',
      },
    ]),

    // Long term caching - https://webpack.js.org/guides/caching/#deterministic-hashes
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: 'webpackManifest',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true,
      minChunks: (module, count) => count >= 6,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true,
      minChunks: chunkIncludes(['codemirror']),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true,
      minChunks: chunkIncludes(['markdown-it', 'markdown-it-katex', 'katex', 'markdown-it-emoji', 'htmlparser2', 'ent', 'linkify-it']),
    }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true,
      minChunks: chunkIncludes(['recharts', 'd3-scale', 'd3-shape', 'react-smooth']),
    }),
    new WebpackChunkHash(),
    new webpack.HashedModuleIdsPlugin(),
  ],
  module: {
    noParse: /\.min\.js$/,
    loaders: [
      // Globals
      {
        test: /\.(css|scss)$/,
        include: [
          path.resolve(__dirname, '../src/client/styles/global'),
        ],
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style',
          loader: [
            { loader: 'css', query: { sourceMap: true } },
            'postcss',
            { loader: 'sass', query: { outputStyle: 'compressed' } },
          ],
        }),
      },
      // CSS Modules
      {
        test: /\.(css|scss)$/,
        include: [
          path.resolve(__dirname, '../src/client'),
          path.resolve(__dirname, '../node_modules/stemn-frontend-shared'),
        ],
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
})
