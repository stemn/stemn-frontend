module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./sendAuthToken.web.js').default
  : require('./sendAuthToken.desktop.js').default
