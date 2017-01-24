import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import baseConfig from './webpack.config.base';

const config = {
  ...baseConfig,
  entry: {
    main: [
      'babel-polyfill',
      './app/renderer/main/index',
    ],
    menubar: [
      'babel-polyfill',
      './app/renderer/menubar/index',
    ],
    preview: [
      'babel-polyfill',
      './app/renderer/preview/index',
    ],
    pdfWorker: './app/node_modules/pdfjs-dist/build/pdf.worker.entry'
  },
  output: {
    ...baseConfig.output,
    path: path.join(__dirname, 'dist', 'renderer'),
    publicPath: '../../',
//    publicPath: '../dist/',
    filename: '[name]/index.js',
  },
  module: {
    ...baseConfig.module,
    loaders: [
      ...baseConfig.module.loaders,
      {
        test: /\.global\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader'
        ),
      }, {
        test: /^((?!\.global).)*\.css$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]-[local]-[emoji:6]'
        ),
      },
    ],
  },
  plugins: [
    ...baseConfig.plugins,
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commonPreview',
      filename: 'commonPreview/index.js',
      chunks: ['main', 'preview'],
    }),    
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common/index.js',
      chunks: ['commonPreview', 'menubar'],
    }),     
    new webpack.DefinePlugin({
      __DEV__                        : false,
      'GLOBAL_ENV'                   : {
        APP_TYPE                     : JSON.stringify('desktop'),
        NODE_ENV                     : JSON.stringify('production'),
        WEBSITE_URL                  : JSON.stringify('https://stemn.com'),
        API_SERVER                   : JSON.stringify(process.env.API_SERVER),
        WEBSOCKET_SERVER             : JSON.stringify(process.env.WEBSOCKET_SERVER),
        ELECTRON_CRASH_REPORT_SERVER : JSON.stringify(process.env.ELECTRON_CRASH_REPORT_SERVER)
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      options: { sourceMap: false },
      compressor: {
        screw_ie8: true,
        warnings: false,
      }
    }),
    new ExtractTextPlugin('[name]/style.css', { allChunks: true }),
  ],
  target: 'electron-renderer',
};

export default config;
