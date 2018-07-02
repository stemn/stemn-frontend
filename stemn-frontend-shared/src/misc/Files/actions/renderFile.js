module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./renderFile.web.js').default
  : require('./renderFile.desktop.js').default
