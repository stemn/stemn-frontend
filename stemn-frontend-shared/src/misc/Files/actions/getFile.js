module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./getFile.web.js')
  : require('./getFile.desktop.js')
