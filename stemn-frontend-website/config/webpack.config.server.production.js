const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('./webpack.config.base')
const getGlobalEnv = require('./getGlobalEnv')

const GLOBALS = getGlobalEnv('production')

module.exports = merge(config, {
  target: 'node',
  devtool: 'cheap-module-source-map',
  entry: {
    index: 'server/index.jsx',
  },
  output: {
    path: path.resolve(__dirname, '../build/server'),
    publicPath: '/',
  },
  plugins: [
    new webpack.DefinePlugin(GLOBALS),
    new ExtractTextPlugin({
      filename: 'styles.css',
      allChunks: true,
    }),
    new webpack.ProvidePlugin({
      window: 'server/mocks/window',
      document: 'server/mocks/document',
      navigator: 'server/mocks/navigator',
    }),
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
