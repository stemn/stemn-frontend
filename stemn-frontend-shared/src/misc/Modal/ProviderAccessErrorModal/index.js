const modalName = 'PROVIDER_ACCESS_ERROR'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./ProviderAccessErrorModal.container').default(modalName)
