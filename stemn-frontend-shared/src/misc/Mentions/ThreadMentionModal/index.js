import registerThreadMentionModal from './ThreadMentionModal.container'

// Registers the modal component and exports its name. The Electron main process
// resolves index.electron.js instead (the name only, no React components).
export default registerThreadMentionModal('THREAD_COMMIT')
