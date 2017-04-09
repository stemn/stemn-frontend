module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./sendAuthToken.web.js')
  : require('./sendAuthToken.desktop.js')
