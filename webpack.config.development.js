/* eslint max-len: 0 */
import webpack from 'webpack';
import baseConfig from './webpack.config.base';
import HappyPack from 'happypack';

const config = {
  ...baseConfig,

  debug: true,

  devtool: 'cheap-module-eval-source-map',

  entry: {
    main: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
      './app/renderer/main/index',
    ],
    menubar: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
      './app/renderer/menubar/index',
    ],
    preview: [
      'babel-polyfill',
      'webpack-hot-middleware/client?path=http://localhost:3001/__webpack_hmr',
      './app/renderer/preview/index',
    ],
  },

  output: {
    ...baseConfig.output,
    publicPath: 'http://localhost:3001/dist/',
  },

  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.global\.css$/,
        loader: 'happypack/loader?id=cssGlobal',
      },

      {
        test: /^((?!\.global).)*\.css$/,
        loader: 'happypack/loader?id=cssLocal',
      },
    ],
  },

  plugins: [
    ...baseConfig.plugins,
    new HappyPack({ threads: 4, id: 'cssLocal',  loaders: [ 'style-loader', 'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name][emoji:6]']}),
    new HappyPack({ threads: 4, id: 'cssGlobal', loaders: [ 'style-loader', 'css-loader?sourceMap']}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commonPreview',
      filename: 'commonPreview.js',
      chunks: ['main', 'preview'],
    }),    
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
      chunks: ['commonPreview', 'menubar'],
    }),      
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        API_SERVER: JSON.stringify(process.env.API_SERVER),
        WEBSOCKET_SERVER: JSON.stringify(process.env.WEBSOCKET_SERVER),
      },
    }),
  ],

  target: 'electron-renderer',
};


export default config;
