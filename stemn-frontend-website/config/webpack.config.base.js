// Common Webpack configuration used by webpack.config.development and webpack.config.production
const { join, sep } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const getStemnEnv = require('./getStemnEnv')

const root = join(__dirname, '..')
const sharedRoot = join(root, '../stemn-frontend-shared')
const assetsRoot = join(root, 'src/client/assets')
const fileTypeIconsDir = join(sharedRoot, 'src/misc/FileList/filetype')

// CSS convention (carried over from the webpack 2 config):
//  - `*.global.(css|scss)` files are always plain global CSS
//  - every other css/scss file in these directories is a CSS module
//  - anything else (e.g. node_modules css) is plain global CSS
const cssModuleDirs = [
  join(assetsRoot, 'javascripts'),
  join(assetsRoot, 'styles/modules'),
  sharedRoot,
].map(dir => dir + sep)
const isCssModule = resourcePath => !/\.global\.(css|scss)$/.test(resourcePath)
  && cssModuleDirs.some(dir => resourcePath.startsWith(dir))

module.exports = ({ mode, styleLoader, refresh = false }) => {
  const isDev = mode === 'development'
  const stemnEnvName = process.env.STEMN_ENV || (isDev ? 'local' : 'production')

  const styleLoaders = [
    styleLoader,
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 2,
        sourceMap: isDev,
        modules: {
          auto: isCssModule,
          localIdentName: '[name]_[local]-[hash:base64:5]',
          namedExport: false,
          exportLocalsConvention: 'as-is',
        },
      },
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        postcssOptions: { plugins: [require('autoprefixer')()] },
      },
    },
  ]

  const sassLoader = {
    loader: require.resolve('sass-loader'),
    options: {
      api: 'modern-compiler',
      sassOptions: {
        quietDeps: true,
        silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'slash-div', 'legacy-js-api'],
      },
    },
  }

  return {
    mode,
    context: root,
    target: 'browserslist:defaults',
    output: {
      path: join(root, 'build/client'),
      publicPath: '/',
      clean: true,
    },
    resolve: {
      symlinks: false,
      modules: [
        join(root, 'src/client/scripts'),
        assetsRoot,
        join(assetsRoot, 'javascripts'),
        // Normal hierarchical lookup (must not be an absolute path, or nested
        // node_modules versions would be shadowed by the hoisted ones)
        'node_modules',
      ],
      alias: {
        'stemn-shared': join(sharedRoot, 'src'),
        theme: join(assetsRoot, 'styles/modules/theme.css'),
        'route-actions': join(assetsRoot, 'javascripts/pages/routeActions.js'),
        reducer: join(assetsRoot, 'javascripts/app/reducer.ts'),
        'get-root-path': join(root, 'src/client/getRootPath.js'),
        // Node-only modules referenced by vendored browser code (primus client, gerber parser)
        ws: false,
        fs: false,
      },
      extensions: ['.web.ts', '.web.tsx', '.web.js', '.web.jsx', '.ts', '.tsx', '.js', '.jsx', '.json', '.scss'],
    },
    module: {
      rules: [
        // JavaScript / TypeScript (app + shared source)
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: [join(assetsRoot, 'javascripts'), join(root, 'src/client/scripts'), join(sharedRoot, 'src')],
          // The vendored primus client is pre-built browser code
          exclude: /primus-websockets\d\.js$/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              babelrc: false,
              configFile: false,
              sourceType: 'unambiguous',
              presets: [
                [require.resolve('@babel/preset-env'), { targets: 'defaults' }],
                [require.resolve('@babel/preset-react'), { runtime: 'automatic', development: isDev }],
                // Babel 8 defaults to only removing `import type`; elide unused (type-only) imports like tsc does
                [require.resolve('@babel/preset-typescript'), { onlyRemoveTypeImports: false }],
              ],
              plugins: [
                // `@connect(...)` class decorators are used throughout the codebase
                [require.resolve('@babel/plugin-proposal-decorators'), { version: 'legacy' }],
                ...(refresh ? [require.resolve('react-refresh/babel')] : []),
              ],
            },
          },
        },
        // Styles. See `isCssModule` for which files are CSS modules.
        {
          test: /\.css$/,
          use: styleLoaders,
        },
        {
          test: /\.scss$/,
          use: [...styleLoaders, sassLoader],
        },
        // Images: anything inside FileList/filetype is always emitted as a file,
        // other small images are inlined.
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          include: [fileTypeIconsDir],
          type: 'asset/resource',
          generator: { filename: 'images/[name].[contenthash:8][ext]' },
        },
        {
          test: /\.(png|jpe?g|gif|svg|mp4)$/,
          exclude: [fileTypeIconsDir],
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 8192 } },
          generator: { filename: 'images/[name].[contenthash:8][ext]' },
        },
        // Fonts
        {
          test: /\.(woff2?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 8192 } },
          generator: { filename: 'fonts/[name].[contenthash:8][ext]' },
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
        GLOBAL_ENV: {
          APP_TYPE: JSON.stringify('web'),
          NODE_ENV: JSON.stringify(mode),
          SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN || ''),
          ...getStemnEnv(stemnEnvName),
        },
      }),
      // Only bundle the english moment locale
      new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
      new HtmlWebpackPlugin({
        template: join(assetsRoot, 'index.html'),
        scriptLoading: 'defer',
      }),
    ],
    performance: { hints: false },
  }
}
