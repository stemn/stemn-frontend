// Common Webpack configuration used by webpack.config.development and webpack.config.production
const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HappyPack = require('happypack')


module.exports = {
  resolve: {
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/), // http://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack
    new webpack.IgnorePlugin(/vertx|bufferutil|utf-8-validate/),       // Ignore vertx so ES6 promise works: https://github.com/stefanpenner/es6-promise/issues/100
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch', // fetch API
    }),
    new HappyPack({
      threads: 4,
      loaders: ['babel'],
    }),
  ],
  module: {
    loaders: [
      // JSON
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../src/client'),
          path.resolve(__dirname, '../src/server'),
          path.resolve(__dirname, '../node_modules/stemn-frontend-shared'),
          path.resolve(__dirname, '../node_modules/react-icons'),
          path.resolve(__dirname, '../node_modules/react-popover-wrapper'),
        ],
        loader: 'happypack/loader',
      },
      // Images
      // Any images inside FileList/filetype should use urls
      // Small images in other folders will be inlined.
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        include: [
          path.resolve(__dirname, '../node_modules/stemn-frontend-shared/src/misc/FileList/filetype'),
        ],
        loader: 'url',
        query: {
          limit: 1,
          name: 'images/[name].[ext]?[hash]',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|mp4)$/,
        exclude: [
          path.resolve(__dirname, '../node_modules/stemn-frontend-shared/src/misc/FileList/filetype'),
        ],
        loader: 'url',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]',
        },
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]',
        },
      },
    ],
  },
  postcss: () => [
    autoprefixer({
      browsers: ['last 2 versions'],
    }),
  ],
}
