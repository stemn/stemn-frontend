module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./FileList.menu.web.js')
  : require('./FileList.menu.desktop.js')
