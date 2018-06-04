module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./authenticate.web.js')
  : require('./authenticate.desktop.js')
