/**
 * Access to the Stemn Desktop preload bridge (`window.stemnDesktop`, see
 * stemn-frontend-desktop/app/preload/index.ts) from renderer code.
 *
 * Desktop windows run with contextIsolation + sandbox, so renderer code cannot
 * import `electron` or Node modules; everything native goes through this bridge.
 */
const missingBridge = () => {
  throw new Error('The Stemn Desktop bridge (window.stemnDesktop) is not available in this context')
}

export const hasBridge = () => typeof window !== 'undefined' && !!window.stemnDesktop

export const getBridge = () => (hasBridge() ? window.stemnDesktop : missingBridge())

/** process.platform of the machine running the app ('win32' | 'darwin' | 'linux') */
export const getPlatform = () => {
  if (hasBridge()) return window.stemnDesktop.platform
  return typeof process !== 'undefined' && process.platform ? process.platform : 'linux'
}
