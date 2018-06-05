module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./downloadFile.web.js')
  : require('./downloadFile.desktop.js')
