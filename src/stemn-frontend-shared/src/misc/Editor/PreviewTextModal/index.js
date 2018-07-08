const modalName = 'PREVIEW_TEXT'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./PreviewTextModal.container').default(modalName)
