'use strict';

// Modules
const path               = require('path');
const webpack            = require('webpack');
const autoprefixer       = require('autoprefixer');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const BowerWebpackPlugin = require("bower-webpack-plugin");
const HappyPack          = require('happypack');
const serverPort         = 3333;

// Env
var ENV    = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig () {
  var config = {};

  // Karma will set this when it's a test build
  config.entry = isTest ? {} : {
    app: './src/app/app.js'
  };

  // rma will handle setting it up for you when it's a test build
  config.output = isTest ? {} : {
    // Absolute output directory
    path          : __dirname + '/dist',
    // Output path from the view of the page
    publicPath    : isProd ? '/'                : `http://localhost:${serverPort}/`,
    // Filename for entry points
    filename      : isProd ? '[name].[hash].js' : '[name].bundle.js',
    // Filename for non-entry points
    chunkFilename : isProd ? '[name].[hash].js' : '[name].bundle.js'
  };

  // Devtool Source Map
  if (isTest) {
    config.devtool = 'inline-source-map';
  } else if (isProd) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'source-map';
//    config.devtool = 'eval-source-map';
  }

  // Loaders
  config.module = {
    preLoaders  : [],
    loaders     : [{
      test      : /\.js$/,
      loaders   : [ 'happypack/loader' ],
      exclude   : /node_modules/,
    }, {
      test      : /\.css$/,
      loader    : isTest ? 'null' : ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap!postcss-loader')
    }, {
      test      : /\.scss$/,
      loaders   : ["style-loader", "css-loader", "sass-loader"]
    }, {
      test      : /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      loader    : 'file'
    }, {
      test      : /\.html$/,
      loader    : 'raw'
    }]
  };

  // Istanbul Loader
  if (isTest) {
    config.module.preLoaders.push({
      test    : /\.js$/,
      exclude : [/node_modules/, /\.spec\.js$/],
      loader  : 'istanbul-instrumenter',
      query   : { esModules: true }
    })
  }

  config.postcss = [
    autoprefixer({
      browsers: ['last 2 version']
    })
  ];
  
  config.resolve = {
    root                 : [path.resolve('./src')],
    modlesDirectories    : ["node_modules", "bower_components"],
    alias                : {
      "ui-router-extras" : __dirname + "/bower_components/ui-router-extras/release/ct-ui-router-extras.js",
      "ngGeolocation"    : __dirname + "/bower_components/ngGeolocation/ngGeolocation.js"
    }
  };
  
  config.plugins = [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
    ),
    new HappyPack({
      loaders      : [ 'babel?presets[]=react' ],
    }),
    new webpack.DefinePlugin({
      GLOBAL_ENV   : {
        ENV_TYPE   : JSON.stringify(process.env.ENV_TYPE),
        API_SERVER : JSON.stringify(process.env.API_SERVER),
      },
    }),
  ];


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
    contentBase    : './src/public',
    port           : serverPort,
    stats          : 'minimal',
    // All images (uploads) are proxied from the API_SERVER
    proxy          : [{
      context      : ['/uploads/**'],
      target       : process.env.API_SERVER,
      secure       : false
    }]
  };

  return config;
}();
