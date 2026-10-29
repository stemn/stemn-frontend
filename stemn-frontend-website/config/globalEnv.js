// GLOBAL_ENV for the website builds (Vite: vite.config.ts, webpack fallback: webpack.config.base.js).
// STEMN_ENV picks the backend (stemn-frontend-shared/config/stemnEnv.cjs):
// `local` by default for the dev server, `production` for builds.
const getStemnEnv = require('stemn-frontend-shared/config/stemnEnv.cjs')

module.exports = function globalEnv({ mode, isDevServer }) {
  const stemnEnvName = process.env.STEMN_ENV || (isDevServer ? 'local' : 'production')
  const stemnEnv = getStemnEnv(stemnEnvName)
  console.log(
    `STEMN_ENV=${stemnEnvName}: API_SERVER=${stemnEnv.API_SERVER} WEBSOCKET_SERVER=${stemnEnv.WEBSOCKET_SERVER}`,
  )
  return {
    APP_TYPE: 'web',
    NODE_ENV: mode,
    STEMN_ENV: stemnEnvName,
    SENTRY_DSN: process.env.SENTRY_DSN || '',
    ...stemnEnv,
  }
}
