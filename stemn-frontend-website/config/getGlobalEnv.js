const GLOBALS = {
  development: {
    'process.env.NODE_ENV': JSON.stringify('development'),
    GLOBAL_ENV: {
      APP_TYPE: JSON.stringify('web'),
      NODE_ENV: JSON.stringify('development'),
      WEBSITE_URL: JSON.stringify('https://dev.stemn.com'),
      API_SERVER: JSON.stringify('https://dev.stemn.com'),
      WEBSOCKET_SERVER: JSON.stringify('https://dev.stemn.com:8443'),
    },
  },
  production: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    GLOBAL_ENV: {
      APP_TYPE: JSON.stringify('web'),
      NODE_ENV: JSON.stringify('production'),
      WEBSITE_URL: JSON.stringify('https://stemn.com'),
      API_SERVER: JSON.stringify('https://stemn.com'),
      WEBSOCKET_SERVER: JSON.stringify('https://stemn.com:8443'),
    },
  },
}

module.exports = env => GLOBALS[env]
