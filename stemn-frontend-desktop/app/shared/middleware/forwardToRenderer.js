import { sendToAllWindows } from '../../main/ipc.js'

/**
 * Main-process middleware: every action reduced by the main store is replayed in
 * every renderer store (with meta.scope 'local' so the renderers don't send it back).
 */
const forwardToRenderer = () => next => (action) => {
  sendToAllWindows(action)
  return next(action)
}

export default forwardToRenderer
