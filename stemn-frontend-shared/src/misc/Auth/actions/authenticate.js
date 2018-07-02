module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./authenticate.web.js').default
  : require('./authenticate.desktop.js').default
