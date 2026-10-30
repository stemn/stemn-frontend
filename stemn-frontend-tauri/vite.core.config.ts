/**
 * Core window build: src/core/index.html -> dist/core/index.html. Resolves like the Electron main
 * process build (the `main` section of electron.vite.config.ts: `.electron.*` then `.desktop.*`,
 * GLOBAL_ENV.APP_THREAD 'electron'), with the Node/Electron modules swapped (vite.shared.ts).
 * Runs after vite.config.ts (same outDir, not emptied).
 */
import { join } from 'node:path'
import { defineConfig } from 'vite'
import {
  coreOverridesPlugin,
  cspPlugin,
  distDir,
  electronPolicy,
  loadDesktopConfig,
  rendererBuildDefaults,
  tauriPolicy,
  tauriRoot,
} from './vite.shared'

export default defineConfig(async (env) => {
  const { main, renderer } = await loadDesktopConfig(env)
  return {
    root: join(tauriRoot, 'src'),
    base: '/',
    publicDir: false as const,
    clearScreen: false,
    plugins: [coreOverridesPlugin(), cspPlugin(tauriPolicy(electronPolicy(renderer)))],
    resolve: main.resolve,
    define: main.define,
    css: main.css,
    build: {
      ...rendererBuildDefaults,
      outDir: distDir,
      emptyOutDir: false,
      assetsDir: 'core-assets',
      sourcemap: false,
      chunkSizeWarningLimit: 4096,
      rolldownOptions: { input: { core: join(tauriRoot, 'src/core/index.html') } },
    },
  }
})
