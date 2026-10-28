const { join } = require('path')
const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const base = require('./webpack.config.base')

const assetsRoot = join(__dirname, '../src/client/assets')
const port = Number(process.env.PORT) || 8080
// React Fast Refresh only when running under `webpack serve`
const refresh = Boolean(process.env.WEBPACK_SERVE)

module.exports = merge(base({ mode: 'development', styleLoader: require.resolve('style-loader'), refresh }), {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    application: 'development',
  },
  output: {
    filename: 'js/[name].js',
  },
  devServer: {
    host: process.env.HOST || 'localhost',
    port,
    hot: true,
    historyApiFallback: true,
    static: [
      { directory: join(assetsRoot, 'images'), publicPath: '/images' },
      { directory: join(assetsRoot, 'static'), publicPath: '/static' },
    ],
    client: {
      overlay: { errors: true, warnings: false, runtimeErrors: false },
    },
  },
  plugins: refresh ? [new ReactRefreshWebpackPlugin({ overlay: false })] : [],
  stats: 'errors-warnings',
  infrastructureLogging: { level: 'warn' },
})
