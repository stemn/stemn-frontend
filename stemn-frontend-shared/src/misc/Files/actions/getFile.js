module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./getFile.web.js').default
  : require('./getFile.desktop.js').default
