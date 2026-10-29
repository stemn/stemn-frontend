// webpack 5 fallback, see webpack.config.base.js
const { join } = require('path')
const { merge } = require('webpack-merge')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const base = require('./webpack.config.base')

const root = join(__dirname, '..')
const entry = { application: join(root, 'src/client/assets/javascripts/app/index.jsx') }
const port = Number(process.env.PORT) || 8081
// React Fast Refresh only when running under `webpack serve`
const refresh = Boolean(process.env.WEBPACK_SERVE)

module.exports = merge(base({ mode: 'development', styleLoader: require.resolve('style-loader'), refresh }), {
  devtool: 'eval-cheap-module-source-map',
  entry,
  output: {
    filename: 'js/[name].js',
  },
  devServer: {
    host: process.env.HOST || 'localhost',
    port,
    hot: true,
    historyApiFallback: true,
    static: [
      { directory: join(root, 'public'), publicPath: '/' },
    ],
    client: {
      overlay: { errors: true, warnings: false, runtimeErrors: false },
    },
  },
  plugins: refresh ? [new ReactRefreshWebpackPlugin({ overlay: false })] : [],
  stats: 'errors-warnings',
  infrastructureLogging: { level: 'warn' },
})
