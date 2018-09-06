// Common Webpack configuration used by webpack.config.development and webpack.config.production
const { join } = require('path')
const autoprefixer = require('autoprefixer')
const HappyPack = require('happypack')

const babelLoaderQuery = {
  presets: [
    'babel-preset-es2015',
    'babel-preset-react',
    'babel-preset-stage-0',
  ].map(require.resolve),
  plugins: [
    'babel-plugin-transform-decorators-legacy',
    'babel-plugin-lodash',
    'react-hot-loader/babel',
  ].map(require.resolve),
}

module.exports = {
  resolve: {
    symlinks: false,
    modules: [
      join(__dirname, '../app/node_modules'),
      join(__dirname, '../../node_modules'),
    ],
    alias: {
      'stemn-shared': join(__dirname, '../../stemn-frontend-shared/src'),
      'stemn-frontend-desktop': join(__dirname, '../'),
      theme: join(__dirname, '../app/theme.css'),
      'route-actions': join(__dirname, '../app/renderer/main/routeActions.js'),
      'package-json': join(__dirname, '../app/package.json'),
      'get-root-path': join(__dirname, '../app/getRootPath.js'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
  },
  plugins: [
    new HappyPack({
      threads: 4,
      loaders: [{
        path: 'babel',
        query: babelLoaderQuery,
      }],
    }),
  ],
  module: {
    loaders: [
      // JSON
      {
        test: /\.json$/,
        loader: 'json-loader',
      }, 
      {
        test: /.ts(x)?$/,
        loader: 'ts-loader',
      },
      // JavaScript / ES6
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'happypack/loader',
      }, {
        test: /\.jsx?$/,
        include: [
          join(__dirname, '../../node_modules/react-icons'),
          join(__dirname, '../app/node_modules/react-popover-wrapper'),
        ],
        loader: 'happypack/loader',
      }, 
      // Images
      // Any images inside FileList/filetype should use urls
      // Small images in other folders will be inlined.
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        include: [
          join(__dirname, '../../stemn-frontend-shared/src/misc/FileList/filetype'),
        ],
        loader: 'url',
        query: {
          limit: 1,
          name: 'images/[name].[ext]?[hash]',
        },
      }, {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        exclude: [
          join(__dirname, '../../stemn-frontend-shared/src/misc/FileList/filetype'),
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
