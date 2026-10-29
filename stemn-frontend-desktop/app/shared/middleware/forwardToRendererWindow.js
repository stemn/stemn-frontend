import { CALL_HISTORY_METHOD } from 'stemn-shared/routing'
import { getBridge } from 'stemn-shared/desktop/bridge'
import { WINDOW_NAMES } from '../ipc/channels.js'

const getScopes = (action) => {
  // Navigation actions carry their scope in the location state ({ state: { meta: { scope } } }, see Link.js)
  const location = action.type === CALL_HISTORY_METHOD && action.payload && action.payload.args && action.payload.args[0]
  const meta = action.meta || (location && location.state && location.state.meta)
  if (!meta || !meta.scope || meta.scope === 'local') return []
  return [].concat(meta.scope).filter(scope => WINDOW_NAMES.includes(scope))
}

/**
 * Renderer middleware: actions scoped to a window (`meta.scope: ['main']`, or a
 * scoped route) are sent to that window instead of being handled here, unless
 * this is that window. E.g. clicking a commit in the menubar navigates the main window.
 */
export const createForwardToRendererWindow = windowName => () => next => (action) => {
  const scopes = getScopes(action)
  if (scopes.length === 0) return next(action)

  scopes
    .filter(scope => scope !== windowName)
    .forEach(target => getBridge().forwardToWindow(target, action))

  return scopes.includes(windowName) ? next(action) : undefined
}

export default createForwardToRendererWindow
