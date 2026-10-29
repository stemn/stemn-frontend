/**
 * Backend urls for each STEMN_ENV. They are baked into the builds at build time as
 * GLOBAL_ENV.* (website vite.config.ts / webpack fallback, desktop electron.vite.config.ts).
 *
 *   STEMN_ENV=local       API http://localhost:3000, websocket http://localhost:8000
 *   STEMN_ENV=staging     staging.stemn.com
 *   STEMN_ENV=production  stemn.com
 *   STEMN_ENV=custom      $API_SERVER, $WEBSOCKET_SERVER, $WEBSITE_URL
 */
const stemnEnvs = {
  custom: {
    API_SERVER: process.env.API_SERVER,
    WEBSITE_URL: process.env.WEBSITE_URL,
    WEBSOCKET_SERVER: process.env.WEBSOCKET_SERVER,
  },
  local: {
    API_SERVER: 'http://localhost:3000',
    WEBSITE_URL: 'http://localhost:8081',
    WEBSOCKET_SERVER: 'http://localhost:8000',
  },
  staging: {
    API_SERVER: 'https://staging.stemn.com',
    WEBSITE_URL: 'https://staging.stemn.com',
    WEBSOCKET_SERVER: 'https://staging.stemn.com:8443',
  },
  production: {
    API_SERVER: 'https://stemn.com',
    WEBSITE_URL: 'https://stemn.com',
    WEBSOCKET_SERVER: 'https://stemn.com:8443',
  },
}

/** Returns the (raw, not stringified) server urls for a STEMN_ENV name */
module.exports = (stemnEnvType) => {
  let stemnEnv = stemnEnvs[stemnEnvType]
  if (!stemnEnv) {
    console.warn(`Unknown STEMN_ENV "${stemnEnvType}". Use one of ${Object.keys(stemnEnvs).join(', ')}. Defaulting to local.`)
    stemnEnv = stemnEnvs.local
  }
  return stemnEnv
}

module.exports.stemnEnvNames = Object.keys(stemnEnvs)
