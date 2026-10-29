import { getBridge } from 'stemn-shared/desktop/bridge'

/**
 * Renderer middleware: plain actions are reduced by the main-process store (the
 * source of truth), which replays them in every window. Only router (`@@...`)
 * actions and actions with meta.scope 'local' are reduced in this window directly.
 */
const forwardToMain = () => next => (action) => {
  const isLocal = action.type && (action.type.startsWith('@@') || (action.meta && action.meta.scope === 'local'))
  if (!isLocal) {
    getBridge().dispatchToMain(action)
    // stop action in-flight
    return undefined
  }
  return next(action)
}

export default forwardToMain
