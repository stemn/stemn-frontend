const modalName = 'THREAD_LABELS'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./ThreadLabelsEditModal.container').default(modalName)
