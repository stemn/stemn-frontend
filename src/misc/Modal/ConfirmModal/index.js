const modalName = 'CONFIRM'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./ConfirmModal.container').default(modalName)
