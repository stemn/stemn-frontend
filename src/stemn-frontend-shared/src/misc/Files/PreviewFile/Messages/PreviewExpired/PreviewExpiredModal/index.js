const modalName = 'PREVIEW_EXPIRED'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./PreviewExpiredModal.container').default(modalName)
