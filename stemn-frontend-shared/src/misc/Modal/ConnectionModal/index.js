const modalName = 'CONNECTION'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./ConnectionModal.container').default(modalName)
