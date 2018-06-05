const modalName = 'BETA'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./BetaModal.container').default(modalName)
