import loadUserData from './loadUserData'
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions.js'

/** Resolves once the store holds an auth token (or after `timeoutMs`) */
export const waitForToken = (getState, { timeoutMs = 10_000, interval = 10 } = {}) =>
  new Promise((resolve) => {
    const start = Date.now()
    const check = () => {
      if (getState().auth.authToken || Date.now() - start >= timeoutMs) resolve()
      else setTimeout(check, interval)
    }
    check()
  })

/**
 * After a login / registration / token exchange: load the user and their settings.
 * Waits for the new token to be in the store first. In the desktop renderers the store is
 * a replica that receives the token from the main process asynchronously, so requests
 * fired straight after the login went out without an Authorization header.
 */
const loadSession = () => async (dispatch, getState) => {
  await waitForToken(getState)
  return Promise.all([dispatch(loadUserData()), dispatch(getSettings())])
}

export default loadSession
