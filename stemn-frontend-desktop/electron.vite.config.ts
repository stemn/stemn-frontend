/**
 * electron-vite config for Stemn Desktop.
 *
 *   main      app/main/index.js        -> dist/main/index.js     (Node, CommonJS, everything bundled)
 *   preload   app/preload/index.ts     -> dist/preload/index.js  (sandboxed preload, CommonJS, bundled)
 *   renderer  app/renderer/{main,menubar,preview}/index.html -> dist/renderer/<name>/index.html
 *
 * The main and renderer bundles share the website conventions (stemn-frontend-website/vite.config.mts):
 *   - `stemn-shared/*` aliases the shared source, `.desktop.*` files win over the generic ones;
 *     the main process additionally prefers `.electron.*` (e.g. the shared modals' index.electron.js,
 *     which export the modal name without pulling React components into the main process)
 *   - `*.module.(s)css` files are CSS modules, every other stylesheet is global
 *     (class names and Sass options: stemn-frontend-shared/config/styles.cjs)
 *   - plain ES modules + JSX in `.jsx`/`.tsx`: Vite's Oxc transform, no Babel
 *
 * GLOBAL_ENV (APP_TYPE 'desktop', APP_THREAD 'electron' in main / 'renderer' in the
 * windows, NODE_ENV, API_SERVER, WEBSOCKET_SERVER, WEBSITE_URL) is baked in at build
 * time. STEMN_ENV picks the backend: `local` by default for `dev`, `production` for builds.
 * STEMN_EDITION / UPDATES_URL pick the update feed (GLOBAL_ENV.STEMN_EDITION, UPDATE_FEED; see
 * config/updateFeed.cjs, shared with electron-builder.config.mjs).
 */
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import type { DeprecationOrId } from 'sass'

const require = createRequire(import.meta.url)
const getStemnEnv = require('stemn-frontend-shared/config/stemnEnv.cjs')
const { scopedClassName, sassOptions } = require('stemn-frontend-shared/config/styles.cjs')
const { resolveUpdateFeed } = require('./config/updateFeed.cjs')

const root = __dirname
const appRoot = join(root, 'app')
const sharedRoot = join(root, '../stemn-frontend-shared/src')

const platformExtensions = (platform: string) => ['.ts', '.tsx', '.js', '.jsx'].map((ext) => `.${platform}${ext}`)
const extensions = [...platformExtensions('desktop'), '.mjs', '.ts', '.tsx', '.js', '.jsx', '.json']
const mainExtensions = [...platformExtensions('electron'), ...extensions]

const aliases = [
  { find: /^stemn-shared(?=\/|$)/, replacement: sharedRoot },
  { find: /^stemn-frontend-desktop(?=\/|$)/, replacement: root },
  { find: /^theme$/, replacement: join(appRoot, 'theme.module.css') },
  { find: /^route-actions$/, replacement: join(appRoot, 'renderer/main/routeActions.js') },
  { find: /^reducer$/, replacement: join(appRoot, 'shared/reducers/rootReducer.base.ts') },
  { find: /^package-json$/, replacement: join(root, 'package.json') },
]

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
    'script-src': [
      "'self'",
      "'wasm-unsafe-eval'",
      'https://developer.api.autodesk.com',
      ...(isDev ? ["'unsafe-inline'", devServerOrigin] : []),
    ],
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
  return Object.entries(directives)
    .map(([name, values]) => `${name} ${[...new Set(values)].join(' ')}`)
    .join('; ')
}

const cspPlugin = (policy: string) => ({
  name: 'stemn-csp',
  transformIndexHtml: () => [
    {
      tag: 'meta',
      attrs: { 'http-equiv': 'Content-Security-Policy', content: policy },
      injectTo: 'head-prepend' as const,
    },
  ],
})

const scssOptions = {
  scss: { ...sassOptions, silenceDeprecations: sassOptions.silenceDeprecations as DeprecationOrId[] },
}

export default defineConfig(({ command, mode }) => {
  const isDev = command === 'serve' || mode === 'development'
  const nodeEnv = isDev ? 'development' : 'production'
  const stemnEnvName = process.env.STEMN_ENV || (command === 'serve' ? 'local' : 'production')
  const stemnEnv = getStemnEnv(stemnEnvName)
  const updateFeed = resolveUpdateFeed(process.env)
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
    STEMN_EDITION: updateFeed.edition,
    UPDATE_FEED: updateFeed,
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

  const css = {
    modules: { generateScopedName: scopedClassName },
    preprocessorOptions: scssOptions,
    postcss: { plugins: [autoprefixer()] },
    devSourcemap: true,
  }

  return {
    main: {
      resolve: {
        alias: aliases,
        extensions: mainExtensions,
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
        react(),
        cspPlugin(contentSecurityPolicy({ isDev, stemnEnv, devServerOrigin: `http://localhost:${devPort}` })),
      ],
      resolve: {
        alias: aliases,
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
