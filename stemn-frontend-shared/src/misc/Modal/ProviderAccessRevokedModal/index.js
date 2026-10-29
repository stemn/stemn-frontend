import registerProviderAccessRevokedModal from './ProviderAccessRevokedModal.container'

// Registers the modal component and exports its name. The Electron main process
// resolves index.electron.js instead (the name only, no React components).
export default registerProviderAccessRevokedModal('PROVIDER_ACCESS_REVOKED')
