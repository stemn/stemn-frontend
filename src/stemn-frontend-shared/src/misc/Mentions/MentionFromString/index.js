module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./index.web.js')
  : require('./index.desktop.js')
