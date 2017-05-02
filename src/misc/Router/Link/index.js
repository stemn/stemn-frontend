module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./Link.container.web.js')
  : require('./Link.container.desktop.js')
