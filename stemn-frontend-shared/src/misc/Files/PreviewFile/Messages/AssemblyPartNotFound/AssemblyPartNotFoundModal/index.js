import registerAssemblyPartNotFoundModal from './AssemblyPartNotFoundModal.container'

// Registers the modal component and exports its name. The Electron main process
// resolves index.electron.js instead (the name only, no React components).
export default registerAssemblyPartNotFoundModal('ASSEMBLY_PART_NOT_FOUND')
