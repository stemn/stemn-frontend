module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./FileList.menu.web.js').default
  : require('./FileList.menu.desktop.js').default
