const modalName = 'PROVIDER_ACCESS_REVOKED'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./ProviderAccessRevokedModal.container').default(modalName)
