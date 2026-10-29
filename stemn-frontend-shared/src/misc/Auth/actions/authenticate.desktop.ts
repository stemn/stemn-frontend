import { oauthCreds } from '../Auth.config'
import { getBridge } from 'stemn-shared/desktop/bridge'
import type { Authenticate, IAuthenticateAction } from './types'

// OAuth happens in the system browser, which redirects to the app's local API server (app/main/api)
const authenticate: Authenticate = (provider) => (dispatch) => {
  if (oauthCreds[provider]) {
    // URLSearchParams stringifies the values (arrays are joined with commas)
    const url = `${oauthCreds[provider].url}?${new URLSearchParams(oauthCreds[provider].params as Record<string, string>).toString()}`
    getBridge().shell.openExternal(url)
  }
  return dispatch<IAuthenticateAction>({
    type: 'AUTH/AUTHENTICATE',
    payload: {},
  })
}

export default authenticate
