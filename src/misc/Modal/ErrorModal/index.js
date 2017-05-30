const modalName = 'ERROR'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./ErrorModal.container').default(modalName)
