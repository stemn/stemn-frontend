import path from 'path';
import webpack from 'webpack';
import baseConfig from './webpack.config.base';

export default {
  ...baseConfig,

  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : false,

  entry: [
    'babel-polyfill',
    './app/main/index',
  ],

  output: {
    path: path.resolve(__dirname, 'dist/main'),
    filename: 'index.js',
  },

  plugins: [
    new webpack.BannerPlugin(
      process.env.NODE_ENV === 'development' ? 'require("source-map-support").install();' : '',
      { raw: true, entryOnly: false }
    ),
    new webpack.DefinePlugin({
      __DEV__                        : false,
      'GLOBAL_ENV'                   : {
        APP_TYPE                     : JSON.stringify('desktop'),
        APP_THREAD                   : JSON.stringify('electron'),
        NODE_ENV                     : JSON.stringify(process.env.NODE_ENV),
        WEBSITE_URL                  : JSON.stringify('http://localhost:3333'),
        API_SERVER                   : JSON.stringify(process.env.API_SERVER),
        WEBSOCKET_SERVER             : JSON.stringify(process.env.WEBSOCKET_SERVER),
        ELECTRON_CRASH_REPORT_SERVER : JSON.stringify(process.env.ELECTRON_CRASH_REPORT_SERVER)
      },
    }),
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false,
  },

  externals: [
    ...baseConfig.externals,
    'source-map-support',
  ],
};
