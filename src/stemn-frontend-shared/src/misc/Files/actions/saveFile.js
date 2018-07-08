module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./downloadFile.web.js').default
  : require('./downloadFile.desktop.js').default
