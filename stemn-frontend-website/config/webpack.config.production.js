const { join } = require('path')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const base = require('./webpack.config.base')

const assetsRoot = join(__dirname, '../src/client/assets')

module.exports = merge(base({ mode: 'production', styleLoader: MiniCssExtractPlugin.loader }), {
  devtool: 'source-map',
  entry: {
    application: 'production',
  },
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
          test: /[\\/]node_modules[\\/](react|react-dom|scheduler|react-redux|redux|react-router|axios|icepick|moment|lodash|react-helmet-async|redux-persist|redux-logger)[\\/]/,
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
      patterns: [
        { from: join(assetsRoot, 'images'), to: 'images' },
        { from: join(assetsRoot, 'static'), to: 'static' },
      ],
    }),
  ],
})
