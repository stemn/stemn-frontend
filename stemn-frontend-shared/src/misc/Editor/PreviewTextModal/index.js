import registerPreviewTextModal from './PreviewTextModal.container'

// Registers the modal component and exports its name. The Electron main process
// resolves index.electron.js instead (the name only, no React components).
export default registerPreviewTextModal('PREVIEW_TEXT')
