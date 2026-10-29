/// <reference types="vite/client" />
// Ambient types for the website and the shared code. vite/client declares the asset
// imports (`*.module.(s)css` -> class map, `*.css` side effects, `*.svg`/`*.png` urls)
// and import.meta.glob / import.meta.hot.

interface GLOBAL_ENV {
  API_SERVER: string,
  APP_TYPE: 'web' | 'desktop',
  APP_THREAD?: string,
  NODE_ENV: 'development' | 'production',
  SENTRY_DSN?: string,
  STEMN_ENV?: string,
  WEBSITE_URL: string,
  WEBSOCKET_SERVER: string,
}

// Replaced at build time (Vite `define` / webpack DefinePlugin)
declare const process: { env: { NODE_ENV: 'development' | 'production' } }
declare const GLOBAL_ENV: GLOBAL_ENV

declare module '@stemn/whats-that-gerber' {
  const lib: (fileName: string) => string;
  export = lib;
}
