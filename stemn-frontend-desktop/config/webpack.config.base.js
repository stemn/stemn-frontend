// Common Webpack configuration used by webpack.config.development and webpack.config.production
const path = require('path')
const autoprefixer = require('autoprefixer')
const HappyPack = require('happypack')

module.exports = {
  resolve: {
    symlinks: false,
    modules: [
      path.join(__dirname, '../app/node_modules'),
      path.join(__dirname, '../../'),
    ],
    alias: {
      theme: path.resolve(__dirname, '../app/theme.css'),
      'route-actions': path.resolve(__dirname, '../app/renderer/main/routeActions.js'),
      'stemn-shared': path.resolve(__dirname, '../app/node_modules/stemn-frontend-shared/src'),
      'package-json': path.resolve(__dirname, '../app/package.json'),
      'get-root-path': path.resolve(__dirname, '../app/getRootPath.js'),
    },
    extensions: ['.js', '.jsx', '.json', '.scss'],
  },
  plugins: [
    new HappyPack({
      threads: 4,
      loaders: [{
        path: 'babel',
      }]
    }),
  ],
  module: {
    loaders: [
      // JSON
      {
        test: /\.json$/,
        loader: 'json-loader',
      }, {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'happypack/loader',
      }, {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../app/node_modules/react-icons'),
          path.resolve(__dirname, '../app/node_modules/stemn-frontend-shared'),
          path.resolve(__dirname, '../app/node_modules/react-popover-wrapper'),
        ],
        loader: 'happypack/loader',
      }, {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        include: [
          path.resolve(__dirname, '../app/node_modules/stemn-frontend-shared/src/misc/FileList/filetype'),
        ],
        loader: 'url',
        query: {
          limit: 1,
          name: 'images/[name].[ext]?[hash]',
        },
      }, {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        exclude: [
          path.resolve(__dirname, '../app/node_modules/stemn-frontend-shared/src/misc/FileList/filetype'),
        ],
        loader: 'url',
        query: {
          limit: 8192,
          name: 'images/[name].[ext]?[hash]',
        },
      }, {
        test: /\.(woff|woff2|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 8192,
          name: 'fonts/[name].[ext]?[hash]',
        },
      },
    ],
  },
  postcss: () => [
    autoprefixer({
      browsers: ['last 2 versions'],
    }),
  ],
}
