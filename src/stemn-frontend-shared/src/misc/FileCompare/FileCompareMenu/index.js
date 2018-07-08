module.exports = GLOBAL_ENV.APP_TYPE === 'web'
  ? require('./FileCompareMenu.web.jsx').default
  : require('./FileCompareMenu.desktop.jsx').default
