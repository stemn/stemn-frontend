/**
 * Replaces stemn-shared/desktop/AutoLaunch/AutoLaunch.middleware.js (auto-launch) with
 * tauri-plugin-autostart (registered in Rust with the `--hidden` argument, like `isHidden: true`).
 */
import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart'

export default (store: any) => (next: any) => (action: any) => {
  if (action.type === 'AUTO_LAUNCH/TOGGLE') {
    return store.dispatch({ ...action, payload: action.meta.status ? enable() : disable() })
  } else if (action.type === 'AUTO_LAUNCH/GET_STATUS') {
    return store.dispatch({ ...action, payload: isEnabled() })
  }
  return next(action)
}
