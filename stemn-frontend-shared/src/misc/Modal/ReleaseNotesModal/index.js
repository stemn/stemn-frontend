const modalName = 'RELEASE_NOTES'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./ReleaseNotesModal.container').default(modalName)
