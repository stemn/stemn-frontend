require('colors')

const stemnEnvs = {
  custom: {
    API_SERVER: process.env.API_SERVER,
    WEBSITE_URL: process.env.WEBSITE_URL,
    WEBSOCKET_SERVER: process.env.WEBSOCKET_SERVER,
    ELECTRON_CRASH_REPORT_SERVER: process.env.ELECTRON_CRASH_REPORT_SERVER,
  },
  local: {
    API_SERVER: 'http://localhost:3000',
    WEBSITE_URL: 'http://stemn.com',
    WEBSOCKET_SERVER: 'http://localhost:8000',
    ELECTRON_CRASH_REPORT_SERVER: 'https://stemn.com:2096',
  },
  staging: {
    API_SERVER: 'https://staging.stemn.com',
    WEBSITE_URL: 'https://staging.stemn.com',
    WEBSOCKET_SERVER: 'https://staging.stemn.com:8443',
    ELECTRON_CRASH_REPORT_SERVER: 'https://staging.stemn.com:2096',
  },
  production: {
    API_SERVER: 'https://stemn.com',
    WEBSITE_URL: 'https://stemn.com',
    WEBSOCKET_SERVER: 'https://stemn.com:8443',
    ELECTRON_CRASH_REPORT_SERVER: 'https://stemn.com:2096',
  },
}

module.exports = (stemnEnvType) => {
  const stemnEnv = stemnEnvs[stemnEnvType] || stemnEnvs.staging
  if (!stemnEnvs[stemnEnvType]) {
    console.log('Set STEMN_ENV to one of '.red + `${Object.keys(stemnEnvs).join(', ')}`.magenta)
    console.log('Defaulting to '.red + 'staging'.magenta)
  }

  return stemnEnv
}
