import { oauthCreds } from '../Auth.config.js'
import { getBridge } from 'stemn-shared/desktop/bridge'

// OAuth happens in the system browser, which redirects to the app's local API server (app/main/api)
export default (provider) => (dispatch) => {
  if (oauthCreds[provider]) {
    const url = `${oauthCreds[provider].url}?${new URLSearchParams(oauthCreds[provider].params).toString()}`
    getBridge().shell.openExternal(url)
  }
  return dispatch({
    type: 'AUTH/AUTHENTICATE',
    payload: {},
  })
}
