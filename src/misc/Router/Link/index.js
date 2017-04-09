module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./Link.container.web.jsx')
  : require('./Link.container.desktop.jsx')
