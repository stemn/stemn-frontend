/**
 * Vite 8 (Rolldown + Oxc) config for the Stemn website.
 *
 *   npm run dev     dev server with React Fast Refresh on http://localhost:8081 (PORT=...)
 *   npm run build   production build -> build/client (+ the express server -> build/server)
 *
 * The webpack 5 fallback (npm run dev:webpack / build:webpack, config/webpack.config.*.js)
 * follows the same conventions:
 *   - `.web.*` files win over the generic ones (the desktop app resolves `.desktop.*`)
 *   - aliases: `stemn-shared/*`, `theme`, `route-actions`, `reducer`, and the `pages/`,
 *     `modules/`, `layout/` folders of src/client/assets/javascripts
 *   - `*.module.(s)css` files are CSS modules, every other stylesheet is global
 *     (class names and Sass options: stemn-frontend-shared/config/styles.cjs)
 *   - GLOBAL_ENV.* is baked in at build time (config/globalEnv.js, STEMN_ENV)
 *   - public/ (images, static) is served / copied as-is
 */
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import autoprefixer from 'autoprefixer'
import type { DeprecationOrId } from 'sass'

const require = createRequire(import.meta.url)
const { scopedClassName, sassOptions } = require('stemn-frontend-shared/config/styles.cjs')
const globalEnv = require('./config/globalEnv.js')

const root = import.meta.dirname
const javascripts = join(root, 'src/client/assets/javascripts')
const sharedSrc = join(root, '../stemn-frontend-shared/src')

export default defineConfig(({ command, mode }) => {
  const nodeEnv = mode === 'production' ? 'production' : 'development'
  const env = globalEnv({ mode: nodeEnv, isDevServer: command === 'serve' })

  return {
    root,
    publicDir: join(root, 'public'),
    plugins: [react()],
    resolve: {
      alias: [
        { find: /^stemn-shared(?=\/|$)/, replacement: sharedSrc },
        { find: /^theme$/, replacement: join(root, 'src/client/assets/styles/modules/theme.module.css') },
        { find: /^route-actions$/, replacement: join(javascripts, 'pages/routeActions.js') },
        { find: /^reducer$/, replacement: join(javascripts, 'app/reducer.ts') },
        { find: /^(pages|modules|layout)\//, replacement: `${javascripts}/$1/` },
      ],
      extensions: ['.web.ts', '.web.tsx', '.web.js', '.web.jsx', '.mjs', '.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
      GLOBAL_ENV: JSON.stringify(env),
      ...Object.fromEntries(Object.entries(env).map(([key, value]) => [`GLOBAL_ENV.${key}`, JSON.stringify(value)])),
    },
    css: {
      modules: {
        generateScopedName: scopedClassName,
      },
      preprocessorOptions: {
        scss: { ...sassOptions, silenceDeprecations: sassOptions.silenceDeprecations as DeprecationOrId[] },
      },
      postcss: { plugins: [autoprefixer()] },
      devSourcemap: true,
    },
    server: {
      host: process.env.HOST || 'localhost',
      port: Number(process.env.PORT) || 8081,
      strictPort: true,
    },
    preview: {
      port: Number(process.env.PORT) || 8081,
      strictPort: true,
    },
    build: {
      outDir: join(root, 'build/client'),
      emptyOutDir: true,
      sourcemap: true,
      chunkSizeWarningLimit: 4096,
    },
  }
})
