// Common Webpack configuration used by webpack.config.development and webpack.config.production
const { resolve } = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const HappyPack = require('happypack')

const babelLoaderQuery = {
  presets: [
    'babel-preset-es2015',
    'babel-preset-react',
    'babel-preset-stage-0',
  ].map(require.resolve),
  plugins: [
    'babel-plugin-transform-decorators-legacy',
    'babel-plugin-lodash',
    'react-hot-loader/babel',
  ].map(require.resolve),
}

module.exports = {
  resolve: {
    symlinks: false,
    modules: [
      resolve(__dirname, '../src/client/scripts'),
      resolve(__dirname, '../src/client/assets'),
      resolve(__dirname, '../src/client/assets/javascripts'),
      resolve(__dirname, '../node_modules'),
      resolve(__dirname, '../../../node_modules'),
    ],
    alias: {
      'stemn-shared': resolve(__dirname, '../../stemn-frontend-shared/src'),
      theme: resolve(__dirname, '../src/client/assets/styles/modules/theme.css'),
      'route-actions': resolve(__dirname, '../src/client/assets/javascripts/pages/routeActions.js'),
      'lodash.get': resolve(__dirname, '../../../node_modules/lodash/get'),
      'lodash.assign': resolve(__dirname, '../../../node_modules/lodash/assign'),
      'lodash.throttle': resolve(__dirname, '../../../node_modules/lodash/throttle'),
      'lodash.topath': resolve(__dirname, '../../../node_modules/lodash/topath'),
      'lodash.repeat': resolve(__dirname, '../../../node_modules/lodash/repeat'),
      'lodash.keys': resolve(__dirname, '../../../node_modules/lodash/keys'),
      'lodash.debounce': resolve(__dirname, '../../../node_modules/lodash/debounce'),
      'get-root-path': resolve(__dirname, '../src/client/getRootPath.js'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/), // http://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack
    new webpack.IgnorePlugin(/vertx|bufferutil|utf-8-validate/),       // Ignore vertx so ES6 promise works: https://github.com/stefanpenner/es6-promise/issues/100
    new webpack.ProvidePlugin({
      fetch: 'imports?this=>global!exports?global.fetch!whatwg-fetch', // fetch API
    }),
    new HappyPack({
      threads: 4,
      loaders: [{
        path: 'babel',
        query: babelLoaderQuery,
      }],
    }),
  ],
  module: {
    loaders: [
      // JSON
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /.ts(x)?$/,
        loader: 'ts-loader',
      },
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        include: [
          resolve(__dirname, '../src/client/assets/javascripts'),
          resolve(__dirname, '../../stemn-frontend-shared'),
          resolve(__dirname, '../../../node_modules/react-icons'),
          resolve(__dirname, '../../../node_modules/react-popover-wrapper'),
        ],
        loader: 'happypack/loader',
      },
      // Images
      // Any images inside FileList/filetype should use urls
      // Small images in other folders will be inlined.
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        include: [
          resolve(__dirname, '../../stemn-frontend-shared/src/misc/FileList/filetype'),
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
          resolve(__dirname, '../../stemn-frontend-shared/src/misc/FileList/filetype'),
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
