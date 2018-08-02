// Common Webpack configuration used by webpack.config.development and webpack.config.production
const { join } = require('path')
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
      join(__dirname, '../src/client/scripts'),
      join(__dirname, '../src/client/assets'),
      join(__dirname, '../src/client/assets/javascripts'),
      join(__dirname, '../node_modules'),
      join(__dirname, '../../node_modules'),
    ],
    alias: {
      'stemn-shared': join(__dirname, '../../stemn-frontend-shared/src'),
      theme: join(__dirname, '../src/client/assets/styles/modules/theme.css'),
      'route-actions': join(__dirname, '../src/client/assets/javascripts/pages/routeActions.js'),
      'lodash.get': join(__dirname, '../../node_modules/lodash/get'),
      'lodash.assign': join(__dirname, '../../node_modules/lodash/assign'),
      'lodash.throttle': join(__dirname, '../node_modules/lodash/throttle'),
      'lodash.repeat': join(__dirname, '../../node_modules/lodash/repeat'),
      'lodash.keys': join(__dirname, '../../node_modules/lodash/keys'),
      'lodash.debounce': join(__dirname, '../../node_modules/lodash/debounce'),
      'get-root-path': join(__dirname, '../src/client/getRootPath.js'),
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
          join(__dirname, '../src/client/assets/javascripts'),
          join(__dirname, '../../stemn-frontend-shared'),
          join(__dirname, '../../node_modules/react-icons'),
          join(__dirname, '../node_modules/react-popover-wrapper'),
        ],
        loader: 'happypack/loader',
      },
      // Images
      // Any images inside FileList/filetype should use urls
      // Small images in other folders will be inlined.
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        include: [
          join(__dirname, '../../stemn-frontend-shared/src/misc/FileList/filetype'),
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
          join(__dirname, '../../stemn-frontend-shared/src/misc/FileList/filetype'),
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
