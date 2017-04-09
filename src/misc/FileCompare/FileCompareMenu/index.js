module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./FileCompareMenu.web.jsx')
  : require('./FileCompareMenu.desktop.jsx')
