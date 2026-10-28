const stemnEnvs = {
  custom: {
    API_SERVER: process.env.API_SERVER,
    WEBSITE_URL: process.env.WEBSITE_URL,
    WEBSOCKET_SERVER: process.env.WEBSOCKET_SERVER,
  },
  local: {
    API_SERVER: 'http://localhost:3000',
    WEBSITE_URL: 'http://localhost:8080',
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

/**
 * Returns the GLOBAL_ENV server urls (JSON stringified, ready for DefinePlugin)
 * for a STEMN_ENV name: custom | local | staging | production
 */
module.exports = (stemnEnvType) => {
  let stemnEnv = stemnEnvs[stemnEnvType]
  if (!stemnEnv) {
    console.warn(`Unknown STEMN_ENV "${stemnEnvType}". Use one of ${Object.keys(stemnEnvs).join(', ')}. Defaulting to local.`)
    stemnEnv = stemnEnvs.local
  }
  console.log(`STEMN_ENV=${stemnEnvType}: API_SERVER=${stemnEnv.API_SERVER} WEBSOCKET_SERVER=${stemnEnv.WEBSOCKET_SERVER}`)
  return Object.fromEntries(Object.entries(stemnEnv).map(([key, val]) => [key, JSON.stringify(val)]))
}
