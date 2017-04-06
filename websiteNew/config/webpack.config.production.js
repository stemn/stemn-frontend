const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('./webpack.config.base');

const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('production')
  },
  GLOBAL_ENV: {
    APP_TYPE: JSON.stringify('web'),
    NODE_ENV: JSON.stringify('production'),
    WEBSITE_URL: JSON.stringify('http://stemn.com'),
    API_SERVER: JSON.stringify('http://35.167.249.144'),
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
};

module.exports = merge(config, {
  debug: false,
  devtool: 'cheap-module-source-map',
  entry: {
    application: 'production',
    vendor: ['react', 'react-dom', 'react-redux', 'react-router', 'react-router-redux', 'redux']
  },
  plugins: [
    // Avoid publishing files when compilation fails
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin(GLOBALS),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        drop_console: true,
        drop_debugger: true,
        dead_code: true,
      },
      output: {
        comments: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new ExtractTextPlugin({
      filename: 'css/app.css',
      allChunks: true
    })
  ],
  module: {
    noParse: /\.min\.js$/,
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
            { loader: 'sass', query: { outputStyle: 'compressed' } }
          ]
        })
      },
      // CSS Modules
       {
         test: /\.(css|scss)$/,
         include: [
           path.resolve(__dirname, '../src/client/assets/javascripts'),
           path.resolve(__dirname, '../src/client/assets/styles/modules'),
           path.resolve(__dirname, '../node_modules/stemn-frontend-shared')
         ],
         loader: ExtractTextPlugin.extract({
           fallbackLoader: 'style',
           loader: [
             {
               loader: 'css',
               query: {
                 modules: true,
                 importLoaders: 1,
                 localIdentName: '[path][name]__[local]--[hash:base64:5]'
               }
             },
             'postcss',
             { loader: 'sass', query: { outputStyle: 'compressed' } }
           ]
         })
       },
    ]
  },
});
