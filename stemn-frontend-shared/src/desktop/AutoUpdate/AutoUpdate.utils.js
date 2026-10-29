/* Main process only (called through FunctionLibrary aliases, see AutoUpdate.actions.js) */

/**
 * The updater lives in stemn-frontend-desktop/app/main/updater; it registers its functions here
 * when it starts so that the aliased actions reach it.
 */
let implementation = null

export const setImplementation = (functions) => {
  implementation = functions
}

const call = (name) => () => {
  if (!implementation) {
    console.warn(`AutoUpdateUtils.${name}: the updater is not running yet`)
    return ''
  }
  return implementation[name]()
}

export const checkForUpdates = call('checkForUpdates')
export const downloadUpdate = call('downloadUpdate')
export const installUpdates = call('installUpdates')
