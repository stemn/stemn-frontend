import path from 'path';
import webpack from 'webpack';

const config = {
  iconPath: 'node_modules/react-icons'
}; 

export default {
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/,
    },{
      test: /react-icons\/(.)*(.js)$/,
      loader: 'babel',
      include: config.iconPath
    },{
      test: /\.json$/,
      loader: 'json-loader',
    },{
      test: /\.(png|jpg|svg)$/,
      loader: 'url-loader?limit=8192'
    } // inline base64 URLs for <=8k images, direct URLs for the rest
],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]/index.js',
    libraryTarget: 'commonjs2',
  },
  resolve: {
    root: [
      path.resolve('./')
    ],
    extensions: ['', '.js', '.jsx'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
  },
  plugins: [
    new webpack.IgnorePlugin(/vertx/), // Ignore vertx so ES6 promise works: https://github.com/stefanpenner/es6-promise/issues/100

  ],
  externals: [{
    // put your node 3rd party libraries which can't be built with webpack here
    // (mysql, mongodb, and so on..)
  }],
};
