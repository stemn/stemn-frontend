const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./webpack.config.base')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const WebpackChunkHash = require('webpack-chunk-hash')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const getStemnEnv = require('./getStemnEnv')

const GLOBALS = {
  'process.env': {
    NODE_ENV: JSON.stringify('production'),
  },
  GLOBAL_ENV: Object.assign({
    APP_TYPE: JSON.stringify('web'),
    NODE_ENV: JSON.stringify('production'),
  }, getStemnEnv(process.env.STEMN_ENV)),
}

const chunkIncludes = targets => ({ context }) => context && context.indexOf('node_modules') >= 0 && targets.find(t => new RegExp(`\\\\${t}\\\\`, 'i').test(context))

module.exports = merge(config, {
  debug: false,
  devtool: 'cheap-module-source-map',
  entry: {
    application: 'production',
    vendor: [
      'axios',
      'icepick',
      'moment',
      'react',
      'react-dom',
      'react-helmet',
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
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new UglifyJsPlugin({
    }),
    //    new webpack.LoaderOptionsPlugin({
    //      minimize: true,
    //      debug: false,
    //    }),
    new ExtractTextPlugin({
      filename: 'css/app.[chunkhash].css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, '../src/client/assets/images'),
        to: 'images',
      }, {
        from: path.join(__dirname, '../src/client/assets/static'),
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
    loaders: [
      // Globals
      {
        test: /\.(css|scss)$/,
        include: [
          path.resolve(__dirname, '../src/client/assets/styles/global'),
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
          path.resolve(__dirname, '../src/client/assets/javascripts'),
          path.resolve(__dirname, '../src/client/assets/styles/modules'),
          path.resolve(__dirname, '../../stemn-frontend-shared'),
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
