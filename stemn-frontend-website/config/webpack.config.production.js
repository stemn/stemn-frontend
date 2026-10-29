// webpack 5 fallback, see webpack.config.base.js
const { join } = require('path')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const base = require('./webpack.config.base')

const root = join(__dirname, '..')
const entry = { application: join(root, 'src/client/assets/javascripts/app/index.jsx') }

module.exports = merge(base({ mode: 'production', styleLoader: MiniCssExtractPlugin.loader }), {
  devtool: 'source-map',
  entry,
  output: {
    filename: 'js/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
  },
  optimization: {
    moduleIds: 'deterministic',
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-redux|redux|react-router|axios|icepick|dayjs|lodash|react-helmet-async|redux-persist|redux-logger)[\\/]/,
          name: 'vendor',
          chunks: 'all',
          priority: 20,
        },
      },
    },
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
      ignoreOrder: true,
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: join(root, 'public'), to: '.' }],
    }),
  ],
})
