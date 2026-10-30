/**
 * Build pieces shared by the Tauri renderer / core / bridge builds.
 *
 * The renderers are not copied: `loadDesktopConfig` evaluates the Electron app's own
 * electron.vite.config.ts and the Tauri builds reuse its `renderer` (and `main`, for the core
 * window) sections: same entries, aliases, platform extensions, CSS modules, GLOBAL_ENV and
 * Content-Security-Policy, with only what differs in Tauri changed here.
 */
import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import type { ConfigEnv, Plugin } from 'vite'
import desktopConfig from '../stemn-frontend-desktop/electron.vite.config'

export const tauriRoot = import.meta.dirname
export const desktopRoot = resolve(tauriRoot, '../stemn-frontend-desktop')
export const sharedRoot = resolve(tauriRoot, '../stemn-frontend-shared/src')
export const distDir = join(tauriRoot, 'dist')
export const DEV_PORT = 5174

/**
 * electron-vite's renderer defaults, which electron.vite.config.ts relies on: no minification (as
 * in the Electron build; lightningcss also rejects an old `@media screen\0` hack in the shared CSS),
 * no module preload polyfill. The target is the oldest supported system webview (WebKitGTK 2.40+,
 * WebView2, WKWebView on macOS 11+) instead of Electron's Chromium.
 */
export const rendererBuildDefaults = {
  target: 'es2022',
  minify: false,
  modulePreload: { polyfill: false },
  reportCompressedSize: false,
}

export const loadDesktopConfig = async (env: ConfigEnv) => {
  // The Electron dev server is :5173; the Tauri one runs next to it
  process.env.STEMN_DESKTOP_DEV_PORT = String(DEV_PORT)
  const config: any = typeof desktopConfig === 'function' ? await (desktopConfig as any)(env) : desktopConfig
  return config as { main: any; renderer: any }
}

/** The Electron renderer CSP (the `stemn-csp` plugin of electron.vite.config.ts) */
export const electronPolicy = (renderer: any): string => {
  const plugin = [renderer.plugins].flat(Infinity).find((p: any) => p && p.name === 'stemn-csp')
  if (!plugin) throw new Error('electron.vite.config.ts has no stemn-csp plugin')
  return plugin.transformIndexHtml()[0].attrs.content
}

/**
 * Same policy plus the Tauri origins: IPC (`ipc://localhost`, `http://ipc.localhost` on Windows)
 * and the file cache scheme on Windows (`http://stemn-file.localhost`, `stemn-file:` elsewhere).
 */
export const tauriPolicy = (policy: string) => {
  const directives = new Map<string, string[]>(
    policy
      .split(';')
      .map((d) => d.trim().split(/\s+/))
      .filter((d) => d[0])
      .map(([name, ...values]) => [name, values]),
  )
  const add = (name: string, ...values: string[]) =>
    directives.set(name, [...new Set([...(directives.get(name) || []), ...values])])
  add('connect-src', 'ipc:', 'http://ipc.localhost', 'http://stemn-file.localhost')
  add('img-src', 'http://stemn-file.localhost')
  add('media-src', 'http://stemn-file.localhost')
  return [...directives].map(([name, values]) => `${name} ${values.join(' ')}`).join('; ')
}

export const cspPlugin = (policy: string): Plugin => ({
  name: 'stemn-tauri-csp',
  transformIndexHtml: () => [
    { tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: policy }, injectTo: 'head-prepend' },
  ],
})

const core = (file: string) => join(tauriRoot, 'src/core', file)

/**
 * The Electron main-process modules that need Node or Electron, and their Tauri versions for the
 * core window. Every other main-process module (store, reducers, middleware, FunctionLibrary,
 * websocket, actions) is used as is.
 */
export const coreFileOverrides = new Map<string, string>([
  [join(desktopRoot, 'app/main/ipc.js'), core('ipc.ts')],
  [join(desktopRoot, 'app/main/postStoreSetup.js'), core('overrides/postStoreSetup.ts')],
  [join(sharedRoot, 'desktop/FileCache/FileCache.js'), core('overrides/FileCache.ts')],
  [join(sharedRoot, 'desktop/FileSave/FileSave.js'), core('overrides/FileSave.ts')],
  [join(sharedRoot, 'desktop/ProviderPath/ProviderPath.utils.js'), core('overrides/ProviderPath.utils.ts')],
  [join(sharedRoot, 'desktop/System/System.utils.js'), core('overrides/System.utils.ts')],
  [join(sharedRoot, 'desktop/ElectronWindows/ElectronWindows.utils.js'), core('overrides/ElectronWindows.utils.ts')],
  [join(sharedRoot, 'desktop/Shell/ShellContext/ShellContext.utils.js'), core('overrides/ShellContext.utils.ts')],
  [join(sharedRoot, 'desktop/AutoLaunch/AutoLaunch.middleware.js'), core('overrides/AutoLaunch.middleware.ts')],
  [join(sharedRoot, 'desktop/AutoUpdate/AutoUpdate.utils.js'), core('overrides/AutoUpdate.utils.ts')],
  [join(sharedRoot, 'desktop/AutoUpdate/AutoUpdate.init.js'), core('overrides/AutoUpdate.init.ts')],
])

/** Libraries of the main process with a small browser equivalent */
export const coreModuleShims: Record<string, string> = {
  'electron-log/main': core('shims/electron-log.ts'),
  'electron-json-storage': core('shims/electron-json-storage.ts'),
  'node:util': core('shims/node-util.ts'),
}

/** Applies coreFileOverrides / coreModuleShims and fails the build on any other Node / Electron import */
export const coreOverridesPlugin = (): Plugin => ({
  name: 'stemn-tauri-core-overrides',
  enforce: 'pre',
  async resolveId(source, importer, options) {
    if (coreModuleShims[source]) return coreModuleShims[source]
    if (source === 'electron' || source.startsWith('node:')) {
      this.error(
        `"${source}" is imported by ${importer}: the core window has no Node/Electron, add an override in vite.shared.ts`,
      )
    }
    if (!importer) return null
    const resolved = await this.resolve(source, importer, { ...options, skipSelf: true })
    if (resolved && coreFileOverrides.has(resolved.id)) return coreFileOverrides.get(resolved.id)
    return resolved
  },
})

/** Dev server: serve the core page at /core/index.html next to the renderers */
export const coreDevPagePlugin = (): Plugin => ({
  name: 'stemn-tauri-core-dev-page',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url || !/^\/core\/(index\.html)?(\?|$)/.test(req.url)) return next()
      const html = readFileSync(core('index.html'), 'utf8').replace('./index.ts', `/@fs${core('index.ts')}`)
      res.setHeader('Content-Type', 'text/html')
      res.end(await server.transformIndexHtml(req.url, html))
    })
  },
})
