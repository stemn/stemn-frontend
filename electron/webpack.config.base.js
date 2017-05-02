import path from 'path';
import webpack from 'webpack';
import HappyPack from 'happypack';

const config = {
  iconPath: 'node_modules/react-icons',
  enableHappy: false
}; 

const babelLoaderQuery = {
  presets: [
    'babel-preset-es2015',
    'babel-preset-react',
    'babel-preset-stage-0'
  ].map(require.resolve),
  plugins: [
    'babel-plugin-transform-decorators-legacy',
  ].map(require.resolve)
}

const getHappyConfig = (enable) => {
  const config = {};
  config.loaders = enable 
    ? [{
      test: /\.jsx?$/,
      loader: 'happypack/loader?id=babel',
      exclude: /node_modules/,
    },{
      test: /(\.js|\.jsx)$/,
      loader: 'happypack/loader?id=babel',
      include: [path.resolve(__dirname, './app/node_modules/react-icons/md')]
    }]
    : [{
      test      : /\.jsx?$/,
      loader    : 'babel',
      exclude   : /node_modules/,
      query     : babelLoaderQuery,
    },{
      test      : /(\.js|\.jsx)$/,
      loader    : 'babel',
      include: [
        path.resolve(__dirname, './app/node_modules/react-icons/md'),
        path.resolve(__dirname, './app/node_modules/stemn-frontend-shared'),
        path.resolve(__dirname, './app/node_modules/react-popover-wrapper'),
      ],
    }];
  
  config.plugins = enable 
    ? [new HappyPack({ threads: 4, id: 'babel', loaders: ['babel']})]
    : [];
  
  return config;
}

const happyConfig = getHappyConfig(config.enableHappy);

export default {
  module: {
    loaders: [
    ...happyConfig.loaders,
    {
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
    symlinks: false,
    root                 : [path.resolve('../')],
    extensions           : ['', '.js', '.jsx'],
    packageMains         : ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main'],
    alias                : {
      'theme'            : path.resolve(__dirname, './app/theme.css'),
      'route-actions'    : path.resolve(__dirname, './app/renderer/main/routeActions.js'),
      'stemn-shared'     : path.resolve(__dirname, './app/node_modules/stemn-frontend-shared/src'),
      'package-json'     : path.resolve(__dirname, './app/package.json'),
    },
    fallback             : [ path.resolve(__dirname, './app/node_modules'), path.resolve(__dirname, './node_modules')]
  },
  resolveLoader          : {
    fallback             : [ path.resolve(__dirname, './app/node_modules'), path.resolve(__dirname, './node_modules')]
  },
  plugins: [
    ...happyConfig.plugins,
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/), // http://stackoverflow.com/questions/25384360/how-to-prevent-moment-js-from-loading-locales-with-webpack
    new webpack.IgnorePlugin(/vertx/)                                  // Ignore vertx so ES6 promise works: https://github.com/stefanpenner/es6-promise/issues/100
  ],
  externals: [{}],
};
