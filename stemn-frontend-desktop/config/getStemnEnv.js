require('colors')

const stemnEnvs = {
  local: {
    WEBSITE_URL: 'http://stemn.com',
    API_SERVER: 'http://localhost:3000',
    WEBSOCKET_SERVER: 'http://localhost:8000',
    ELECTRON_CRASH_REPORT_SERVER: 'https://stemn.com:2096',
  },
  staging: {
    WEBSITE_URL: 'https://staging.stemn.com',
    API_SERVER: 'https://staging.stemn.com',
    WEBSOCKET_SERVER: 'https://staging.stemn.com:8443',
    ELECTRON_CRASH_REPORT_SERVER: 'https://staging.stemn.com:2096',
  },
  production: {
    WEBSITE_URL: 'https://stemn.com',
    API_SERVER: 'https://stemn.com',
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