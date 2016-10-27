/* eslint max-len: 0 */
import webpack from 'webpack';
import baseConfig from './webpack.config.base';

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
        loaders: [
          'style-loader',
          'css-loader?sourceMap',
        ],
      },

      {
        test: /^((?!\.global).)*\.css$/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name][emoji:6]',
        ],
      },
    ],
  },

  plugins: [
    ...baseConfig.plugins,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
      chunks: ['main', 'menubar', 'preview'],
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
