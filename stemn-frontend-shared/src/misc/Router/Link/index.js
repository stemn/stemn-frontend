module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./Link.container.web.js').default
  : require('./Link.container.desktop.js').default
