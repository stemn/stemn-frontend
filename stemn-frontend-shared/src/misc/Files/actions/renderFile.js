module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./renderFile.web.js')
  : require('./renderFile.desktop.js')
