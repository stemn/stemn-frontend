// If we are in the electron main thread, we don't want to register the modal
const modalName = 'THREAD_COMMIT'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./ThreadMentionModal.container').default(modalName)