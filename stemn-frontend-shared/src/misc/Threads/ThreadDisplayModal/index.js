// If we are in the electron main thread, we don't want to register the modal
const modalName = 'TASK_DISPLAY'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./ThreadDisplayModal.container').default(modalName)
