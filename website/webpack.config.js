'use strict';

// Modules
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BowerWebpackPlugin = require("bower-webpack-plugin");

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig () {
  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   * Should be an empty object if it's generating a test build
   * Karma will set this when it's a test build
   */
  config.entry = isTest ? {} : {
    app: './src/app/app.js'
  };

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   * Should be an empty object if it's generating a test build
   * Karma will handle setting it up for you when it's a test build
   */
  config.output = isTest ? {} : {
    // Absolute output directory
    path: __dirname + '/dist',

    // Output path from the view of the page
    // Uses webpack-dev-server in development
    publicPath: isProd ? '/' : 'http://localhost:8080/',

    // Filename for entry points
    // Only adds hash in build mode
    filename: isProd ? '[name].[hash].js' : '[name].bundle.js',

    // Filename for non-entry points
    // Only adds hash in build mode
    chunkFilename: isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isTest) {
    config.devtool = 'inline-source-map';
  } else if (isProd) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval-source-map';
  }
  
  config.devtool = 'source-map';

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */

  // Initialize module
  config.module = {
    preLoaders: [],
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      query: { presets:['react'] }
    }, {
      test: /\.css$/,
      loader: isTest ? 'null' : ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader')
    }, {
      test: /\.scss$/,
      loaders: ["style-loader", "css-loader", "sass-loader"]
    }, {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader: 'file'
    }, {
      test: /\.html$/,
      loader: 'raw'
    }]
  };

  // ISTANBUL LOADER
  // https://github.com/deepsweet/istanbul-instrumenter-loader
  // Instrument JS files with istanbul-lib-instrument for subsequent code coverage reporting
  // Skips node_modules and files that end with .test
  if (isTest) {
    config.module.preLoaders.push({
      test: /\.js$/,
      exclude: [
        /node_modules/,
        /\.spec\.js$/
      ],
      loader: 'istanbul-instrumenter',
      query: {
        esModules: true
      }
    })
  }

  config.postcss = [
    autoprefixer({
      browsers: ['last 2 version']
    })
  ];
  
  config.resolve = {
    modlesDirectories: ["node_modules", "bower_components"],
    alias: {
      "ui-router-extras" : __dirname + "/bower_components/ui-router-extras/release/ct-ui-router-extras.js",
      "restangular"      : __dirname + "/bower_components/restangular/dist/restangular.js",
      "ngGeolocation"    : __dirname + "/bower_components/ngGeolocation/ngGeolocation.js",
    }
  };
  
  config.plugins = [];
  
  config.plugins.push(
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    )
  )

  // Skip rendering index.html in test mode
  if (!isTest) {
    config.plugins.push(
      new HtmlWebpackPlugin({
        template: './src/public/index.html',
        inject: 'body'
      }),
      new ExtractTextPlugin('[name].[hash].css', {disable: !isProd})
    )
  }

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin(),
      new CopyWebpackPlugin([{
        from: __dirname + '/src/public'
      }])
    )
  }

  // Dev server configuration
  config.devServer = {
    contentBase: './src/public',
    stats: 'minimal'
  };

  return config;
}();
