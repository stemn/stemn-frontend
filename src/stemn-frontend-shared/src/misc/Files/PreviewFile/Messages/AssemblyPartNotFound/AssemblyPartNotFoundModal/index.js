const modalName = 'ASSEMBLY_PART_NOT_FOUND'
export default GLOBAL_ENV.APP_THREAD === 'electron'
  ? modalName
  : require('./AssemblyPartNotFoundModal.container').default(modalName)
