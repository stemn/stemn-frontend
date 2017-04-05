// Common Webpack configuration used by webpack.config.development and webpack.config.production
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HappyPack = require('happypack');
const querystring = require('querystring');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const babelLoaderQuery = {
  presets: [
    'babel-preset-es2015-native-modules',
    'babel-preset-react',
    'babel-preset-stage-0'
  ].map(require.resolve),
  plugins: [
    'babel-plugin-transform-decorators-legacy',
    'react-hot-loader/babel'
  ].map(require.resolve),
};


module.exports = {
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, '../build/client'),
    publicPath: '/'
  },
  resolve: {
    symlinks: false,
    modules: [
      path.join(__dirname, '../src/client/scripts'),
      path.join(__dirname, '../src/client/assets'),
      path.join(__dirname, '../src/client/assets/javascripts'),
      'node_modules'
    ],
    alias: {
      'stemn-shared': path.resolve(__dirname, '../node_modules/stemn-frontend-shared/src'),
      'theme': path.resolve(__dirname, '../src/client/assets/styles/modules/theme.css'),
      'route-actions': path.resolve(__dirname, '../src/client/assets/javascripts/pages/routeActions.js'),
    },
    extensions: ['.js', '.jsx', '.json', '.scss']
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'  // fetch API
    }),
    // Shared code
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js/vendor.bundle.js',
      minChunks: Infinity
    }),
    new HappyPack({
      threads: 4,
      loaders: [{
        path: 'babel',
        query: babelLoaderQuery
      }],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/client/assets/index.html'),
      filename: 'index.html',
      inject: 'body',
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
          path.resolve(__dirname, '../src/client/assets/javascripts'),
          path.resolve(__dirname, '../node_modules/stemn-frontend-shared'),
          path.resolve(__dirname, '../node_modules/react-icons'),
          path.resolve(__dirname, '../node_modules/react-popover-wrapper'),
        ],
        loader: 'happypack/loader'
      },
      // Images
      // Inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]'
        }
      },
      // Fonts
      {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]'
        }
      }
    ]
  },
  postcss: function () {
    return [
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ];
  }
};
