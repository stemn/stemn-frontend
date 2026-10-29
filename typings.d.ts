// CSS modules (css-loader `namedExport: false`): use `import classes from './x.scss'`
declare module '*.scss' {
  const classNames: { readonly [className: string]: string }
  export default classNames
}

declare module '*.css' {
  const classNames: { readonly [className: string]: string }
  export default classNames
}

declare module '*.svg' {
  const svg: any;
  export default svg;
}

interface GLOBAL_ENV {
  API_SERVER: string,
  APP_TYPE: 'web' | 'desktop',
  APP_THREAD?: string,
  NODE_ENV: 'development' | 'production',
  SENTRY_DSN?: string,
  WEBSITE_URL: string,
  WEBSOCKET_SERVER: string,
}

// Replaced at build time by webpack DefinePlugin
declare const process: { env: { NODE_ENV: 'development' | 'production' } }
declare const GLOBAL_ENV: GLOBAL_ENV

declare module '@stemn/whats-that-gerber' {
  const lib: (fileName: string) => string;
  export = lib;
}
