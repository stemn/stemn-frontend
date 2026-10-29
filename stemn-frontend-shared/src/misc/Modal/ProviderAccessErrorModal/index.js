import registerProviderAccessErrorModal from './ProviderAccessErrorModal.container'

// Registers the modal component and exports its name. The Electron main process
// resolves index.electron.js instead (the name only, no React components).
export default registerProviderAccessErrorModal('PROVIDER_ACCESS_ERROR')
