// webpack 5 FALLBACK build (npm run dev:webpack / build:webpack). The primary toolchain is Vite
// (../vite.config.ts); this config follows the same conventions and is kept working until the
// webpack fallback is retired (see docs/DECISIONS.md).
// Common configuration used by webpack.config.development and webpack.config.production.
const { join } = require('path')
const { readFileSync } = require('fs')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { scopedClassName, sassOptions } = require('stemn-frontend-shared/config/styles.cjs')
const globalEnv = require('./globalEnv')

const root = join(__dirname, '..')
const sharedRoot = join(root, '../stemn-frontend-shared')
const javascripts = join(root, 'src/client/assets/javascripts')
const fileTypeIconsDir = join(sharedRoot, 'src/misc/FileList/filetype')

// index.html is Vite's entry html; html-webpack-plugin injects the webpack bundles instead
// of Vite's module script.
const htmlTemplate = readFileSync(join(root, 'index.html'), 'utf8').replace(
  /\s*<script type="module" src="[^"]*"><\/script>/,
  '',
)

module.exports = ({ mode, styleLoader, refresh = false }) => {
  const isDev = mode === 'development'
  const env = globalEnv({ mode, isDevServer: Boolean(process.env.WEBPACK_SERVE) })

  const styleLoaders = [
    styleLoader,
    {
      loader: require.resolve('css-loader'),
      options: {
        importLoaders: 2,
        sourceMap: isDev,
        // Standard convention: only `*.module.(s)css` files are CSS modules
        modules: {
          auto: true,
          getLocalIdent: (context, _localIdentName, localName) => scopedClassName(localName, context.resourcePath),
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
      sassOptions,
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
      alias: {
        'stemn-shared': join(sharedRoot, 'src'),
        theme$: join(root, 'src/client/assets/styles/modules/theme.module.css'),
        'route-actions$': join(javascripts, 'pages/routeActions.js'),
        reducer$: join(javascripts, 'app/reducer.ts'),
        pages: join(javascripts, 'pages'),
        modules: join(javascripts, 'modules'),
        layout: join(javascripts, 'layout'),
      },
      // `.webpack.js`: webpack-only variants of modules that use Vite APIs (import.meta.glob)
      extensions: ['.webpack.js', '.web.ts', '.web.tsx', '.web.js', '.web.jsx', '.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        // JavaScript / TypeScript (app + shared source)
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: [javascripts, join(sharedRoot, 'src')],
          // Vendored, pre-built browser code
          exclude: [/primus-websockets\d\.js$/],
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
              plugins: refresh ? [require.resolve('react-refresh/babel')] : [],
            },
          },
        },
        // Styles (`*.module.(s)css` are CSS modules, see css-loader `modules.auto`)
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
        GLOBAL_ENV: Object.fromEntries(Object.entries(env).map(([key, value]) => [key, JSON.stringify(value)])),
      }),
      new HtmlWebpackPlugin({
        templateContent: htmlTemplate,
        scriptLoading: 'defer',
      }),
    ],
    performance: { hints: false },
  }
}
