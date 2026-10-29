/// <reference types="vite/client" />
// Ambient types for the desktop app (the website's ../typings.d.ts declares a
// browser-only `process`, which clashes with @types/node used by main/preload).
// vite/client declares the asset imports (`*.module.(s)css`, `*.css`, `*.svg`, ...).

declare module '*?asset' {
  const path: string
  export default path
}

interface GLOBAL_ENV {
  API_SERVER: string
  APP_TYPE: 'web' | 'desktop'
  APP_THREAD?: 'electron' | 'renderer'
  APP_VERSION?: string
  NODE_ENV: 'development' | 'production'
  SENTRY_DSN?: string
  STEMN_ENV?: string
  WEBSITE_URL: string
  WEBSOCKET_SERVER: string
}

// Replaced at build time (electron.vite.config.ts `define`)
declare const GLOBAL_ENV: GLOBAL_ENV

declare module '@stemn/whats-that-gerber' {
  const lib: (fileName: string) => string
  export = lib
}
