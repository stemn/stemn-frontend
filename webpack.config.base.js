import path from 'path';
import webpack from 'webpack';
import HappyPack from 'happypack';
const config = {
  iconPath: 'node_modules/react-icons'
}; 

export default {
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'happypack/loader?id=babel',
      exclude: /node_modules/,
    },{
      test: /(\.js|\.jsx)$/,
      loader: 'happypack/loader?id=babel',
      include: [path.resolve(__dirname, './app/node_modules/react-icons/md')],
    },{
      test: /\.json$/,
      loader: 'json-loader',
    },{
      test: /\.(png|jpg|svg)$/,
      loader: 'url-loader?limit=8192'
    }],
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
    new HappyPack({ threads: 4, id: 'babel', loaders: [ 'babel' ]}),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/), // http://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack
    new webpack.IgnorePlugin(/vertx/), // Ignore vertx so ES6 promise works: https://github.com/stefanpenner/es6-promise/issues/100
  ],
  externals: [{
    // put your node 3rd party libraries which can't be built with webpack here
    // (mysql, mongodb, and so on..)
  }],
};