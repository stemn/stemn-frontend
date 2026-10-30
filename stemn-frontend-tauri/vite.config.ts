/**
 * Renderer build for the Tauri shell: the Electron app's `renderer` config
 * (stemn-frontend-desktop/electron.vite.config.ts) with the Tauri CSP, output in dist/.
 *
 *   dist/{main,menubar,preview}/index.html   the three windows (the same entries as Electron)
 *   dist/core/index.html                     the core window (vite.core.config.ts)
 *
 * `vite` (dev) serves the renderers and the core page on :5174 for `tauri dev`.
 */
import { defineConfig } from 'vite'
import {
  DEV_PORT,
  coreDevPagePlugin,
  coreOverridesPlugin,
  cspPlugin,
  distDir,
  electronPolicy,
  loadDesktopConfig,
  rendererBuildDefaults,
  tauriPolicy,
} from './vite.shared'

export default defineConfig(async (env) => {
  const { renderer } = await loadDesktopConfig(env)
  const plugins = [renderer.plugins].flat(Infinity).filter((p: any) => p && p.name !== 'stemn-csp')
  return {
    ...renderer,
    base: '/',
    clearScreen: false,
    plugins: [...plugins, cspPlugin(tauriPolicy(electronPolicy(renderer))), coreOverridesPlugin(), coreDevPagePlugin()],
    server: { port: DEV_PORT, strictPort: true },
    // no source maps in the app bundle (Electron excludes them from the package: electron-builder.yml)
    build: { ...rendererBuildDefaults, ...renderer.build, sourcemap: false, outDir: distDir, emptyOutDir: true },
  }
})
