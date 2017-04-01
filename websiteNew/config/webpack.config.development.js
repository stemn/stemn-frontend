const merge = require('webpack-merge');
const webpack = require('webpack');
const config = require('./webpack.config.base');
const path = require('path');


const GLOBALS = {
  'process.env': {
    'NODE_ENV': JSON.stringify('development')
  },
  GLOBAL_ENV: {
    APP_TYPE: JSON.stringify('web'),
    NODE_ENV: JSON.stringify('development'),
    WEBSITE_URL: JSON.stringify('http://stemn.com'),
    API_SERVER: JSON.stringify('http://35.167.249.144'),
  },
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'true'))
};


module.exports = merge(config, {
  debug: true,
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: {
    application: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      'development'
    ],
    vendor: ['react', 'react-dom', 'react-redux', 'react-router', 'react-router-redux', 'redux']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin(GLOBALS)
  ],
  module: {
    loaders: [
      // Global Sass
      {
        test: /\.(css|scss)$/,
        include: [
          path.resolve(__dirname, '../src/client/assets/styles/global'),
        ],
        loaders: [
          'style',
          'css',
          'postcss',
          { loader: 'sass', query: { outputStyle: 'expanded' } }
        ]
      },
      // Sass + CSS Modules
       {
         test: /\.(css|scss)$/,
         include: [
           path.resolve(__dirname, '../src/client/assets/javascripts'),
           path.resolve(__dirname, '../src/client/assets/styles/modules'),
           path.resolve(__dirname, '../node_modules/stemn-frontend-shared')
         ],
         loaders: [
           'style',
           {
             loader: 'css',
             query: {
               modules: true,
               importLoaders: 1,
               localIdentName: '[name]__[local]--[hash:base64:5]'
             }
           },
           'postcss',
           { loader: 'sass', query: { outputStyle: 'expanded' } }
         ]
       }
    ]
  }
});
