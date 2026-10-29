/**
 * electron-vite config for Stemn Desktop.
 *
 *   main      app/main/index.js        -> dist/main/index.js     (Node, CommonJS, everything bundled)
 *   preload   app/preload/index.ts     -> dist/preload/index.js  (sandboxed preload, CommonJS, bundled)
 *   renderer  app/renderer/{main,menubar,preview}/index.html -> dist/renderer/<name>/index.html
 *
 * The main and renderer bundles share the website conventions:
 *   - `stemn-shared/*` aliases the shared source, `.desktop.*` files win over the generic ones
 *   - every non-global stylesheet is a CSS module (see config/vite-plugin-stemn-css-modules.mts)
 *   - legacy `@connect()` decorators, JSX in `.js` files and the shared code's
 *     `GLOBAL_ENV.APP_TYPE` / `APP_THREAD` platform switches are compiled by Babel
 *     (see config/babel-plugin-stemn-platform.mts)
 *
 * GLOBAL_ENV (APP_TYPE 'desktop', APP_THREAD 'electron' in main / 'renderer' in the
 * windows, NODE_ENV, API_SERVER, WEBSOCKET_SERVER, WEBSITE_URL) is baked in at build
 * time. STEMN_ENV picks the backend: `local` by default for `dev`, `production` for builds.
 */
import { join, sep } from 'node:path'
import { createRequire } from 'node:module'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import autoprefixer from 'autoprefixer'
import type { DeprecationOrId } from 'sass'
import stemnCssModules from './config/vite-plugin-stemn-css-modules.mts'
import stemnPlatformPlugin from './config/babel-plugin-stemn-platform.mts'

const require = createRequire(import.meta.url)
const getStemnEnv = require('./config/getStemnEnv.js')

const root = __dirname
const appRoot = join(root, 'app')
const sharedRoot = join(root, '../stemn-frontend-shared/src')

const desktopExtensions = ['.desktop.ts', '.desktop.tsx', '.desktop.js', '.desktop.jsx']
const extensions = [...desktopExtensions, '.mjs', '.ts', '.tsx', '.js', '.jsx', '.json', '.scss']

const aliases = (extra: Record<string, string> = {}) => [
  // webpack-style `~module` imports in stylesheets. The alias plugin only applies
  // the first matching entry, so `~stemn-shared` needs its own absolute entry.
  { find: /^~?stemn-shared(?=\/|$)/, replacement: sharedRoot },
  { find: /^~(?=[^/])/, replacement: '' },
  { find: /^stemn-frontend-desktop(?=\/|$)/, replacement: root },
  { find: /^theme$/, replacement: join(appRoot, 'theme.css') },
  { find: /^route-actions$/, replacement: join(appRoot, 'renderer/main/routeActions.js') },
  { find: /^reducer$/, replacement: join(appRoot, 'shared/reducers/rootReducer.base.ts') },
  { find: /^package-json$/, replacement: join(root, 'package.json') },
  ...Object.entries(extra).map(([find, replacement]) => ({ find: new RegExp(`^${find}$`), replacement })),
]

// Vendored, pre-built code that must not go through Babel
const babelExclude = [
  /[\\/]node_modules[\\/]/,
  /primus-[\w.-]+\.js$/,
  /PreviewPcb[\\/]viewer[\\/]three(\.min)?\.js$/,
]

const babelPlugin = (env: Record<string, string>, { jsxDev }: { jsxDev: boolean }) => babel({
  include: [/\.[jt]sx?$/],
  exclude: babelExclude,
  plugins: [
    [stemnPlatformPlugin, { env }],
    // `@connect(...)` class decorators are used throughout the codebase
    [require.resolve('@babel/plugin-proposal-decorators'), { version: 'legacy' }],
  ],
  overrides: [{
    // (`test` is a standard Babel override option, missing from the plugin's types)
    // JSX in plain `.js` files: Vite's Oxc transform only parses JSX in .jsx/.tsx,
    // so Babel compiles it here (Oxc still adds React Refresh to these modules)
    test: /\.js$/,
    parserOpts: { plugins: ['jsx'] },
    plugins: [[require.resolve('@babel/plugin-transform-react-jsx'), { runtime: 'automatic', development: jsxDev }]],
  } as Record<string, unknown>],
})

/**
 * Content-Security-Policy for the renderer pages. The windows load our own bundle
 * only; network access is limited to the Stemn API / websocket servers (plus the
 * Autodesk viewer CDN and https images/iframes used by the file previews).
 */
const contentSecurityPolicy = ({ isDev, stemnEnv, devServerOrigin }) => {
  const toWs = (url: string) => url.replace(/^http/, 'ws')
  const backend = [stemnEnv.API_SERVER, stemnEnv.WEBSOCKET_SERVER, toWs(stemnEnv.WEBSOCKET_SERVER)].filter(Boolean)
  const dev = isDev ? [devServerOrigin, toWs(devServerOrigin)] : []
  const directives = {
    'default-src': ["'self'"],
    // Vite's dev client and the React Refresh preamble are inline scripts
    'script-src': ["'self'", "'wasm-unsafe-eval'", 'https://developer.api.autodesk.com', ...(isDev ? ["'unsafe-inline'", devServerOrigin] : [])],
    'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://developer.api.autodesk.com'],
    'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
    'img-src': ["'self'", 'data:', 'blob:', 'stemn-file:', 'https:', ...backend],
    'media-src': ["'self'", 'blob:', 'stemn-file:', 'https:', ...backend],
    'connect-src': ["'self'", 'stemn-file:', 'https:', ...backend, ...dev],
    'worker-src': ["'self'", 'blob:'],
    'frame-src': ['https:'],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'none'"],
  }
  return Object.entries(directives).map(([name, values]) => `${name} ${[...new Set(values)].join(' ')}`).join('; ')
}

const cspPlugin = (policy: string) => ({
  name: 'stemn-csp',
  transformIndexHtml: () => [{
    tag: 'meta',
    attrs: { 'http-equiv': 'Content-Security-Policy', content: policy },
    injectTo: 'head-prepend' as const,
  }],
})

const scssOptions = {
  scss: {
    quietDeps: true,
    silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'slash-div', 'legacy-js-api'] as DeprecationOrId[],
  },
}

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve' || mode === 'development'
  const nodeEnv = isDev ? 'development' : 'production'
  const stemnEnvName = process.env.STEMN_ENV || (command === 'serve' ? 'local' : 'production')
  const stemnEnv = getStemnEnv(stemnEnvName)
  const devPort = Number(process.env.STEMN_DESKTOP_DEV_PORT) || 5173
  // `dev` writes main/preload to out/ so it never mixes with a production build in dist/
  const outRoot = join(root, command === 'serve' ? 'out' : 'dist')
  if (command === 'serve') {
    process.env.ELECTRON_ENTRY = join(outRoot, 'main/index.js')
  }

  const globalEnv = (appThread: 'electron' | 'renderer') => ({
    APP_TYPE: 'desktop',
    APP_THREAD: appThread,
    NODE_ENV: nodeEnv,
    STEMN_ENV: stemnEnvName,
    SENTRY_DSN: process.env.SENTRY_DSN || '',
    APP_VERSION: require('./package.json').version,
    ...stemnEnv,
  })

  const define = (appThread: 'electron' | 'renderer') => {
    const env = globalEnv(appThread)
    return {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      GLOBAL_ENV: JSON.stringify(env),
      ...Object.fromEntries(Object.entries(env).map(([key, value]) => [`GLOBAL_ENV.${key}`, JSON.stringify(value)])),
    }
  }

  const cssModulesPlugin = stemnCssModules({
    include: [appRoot, sharedRoot],
    globalDirs: [join(sharedRoot, 'assets/css') + sep],
  })

  const css = {
    preprocessorOptions: scssOptions,
    postcss: { plugins: [autoprefixer()] },
    devSourcemap: true,
  }

  return {
    main: {
      plugins: [
        babelPlugin({ APP_TYPE: 'desktop', APP_THREAD: 'electron' }, { jsxDev: false }),
        cssModulesPlugin,
      ],
      resolve: {
        alias: aliases({
          // The vendored primus client only needs `ws` when there is no global
          // WebSocket; Electron's Node (24) has one.
          ws: join(root, 'config/shims/ws.cjs'),
        }),
        extensions,
      },
      define: define('electron'),
      css,
      build: {
        outDir: join(outRoot, 'main'),
        sourcemap: true,
        // Bundle every dependency: the packaged app ships without node_modules
        externalizeDeps: false,
        rolldownOptions: {
          input: { index: join(appRoot, 'main/index.js') },
          // optional peer of unzipper's (unused) S3 support
          external: ['@aws-sdk/client-s3'],
        },
      },
    },
    preload: {
      resolve: { extensions },
      define: { 'process.env.NODE_ENV': JSON.stringify(nodeEnv) },
      build: {
        outDir: join(outRoot, 'preload'),
        sourcemap: isDev ? 'inline' : false,
        // Sandboxed preloads can only require('electron'): bundle everything
        externalizeDeps: false,
        rolldownOptions: {
          input: { index: join(appRoot, 'preload/index.ts') },
        },
      },
    },
    renderer: {
      root: join(appRoot, 'renderer'),
      publicDir: join(appRoot, 'static'),
      plugins: [
        babelPlugin({ APP_TYPE: 'desktop', APP_THREAD: 'renderer' }, { jsxDev: isDev }),
        react(),
        cssModulesPlugin,
        cspPlugin(contentSecurityPolicy({ isDev, stemnEnv, devServerOrigin: `http://localhost:${devPort}` })),
      ],
      optimizeDeps: {
        // moment locales must share the prebundled moment instance
        include: ['moment', 'moment/locale/en-gb'],
        // the dependency scanner parses the app source: it has JSX in .js files
        rolldownOptions: { moduleTypes: { '.js': 'jsx' } },
      },
      resolve: {
        alias: aliases(),
        extensions,
      },
      define: define('renderer'),
      css,
      server: {
        port: devPort,
        strictPort: true,
      },
      build: {
        outDir: join(outRoot, 'renderer'),
        sourcemap: true,
        chunkSizeWarningLimit: 4096,
        rolldownOptions: {
          input: {
            main: join(appRoot, 'renderer/main/index.html'),
            menubar: join(appRoot, 'renderer/menubar/index.html'),
            preview: join(appRoot, 'renderer/preview/index.html'),
          },
        },
      },
    },
  }
})

