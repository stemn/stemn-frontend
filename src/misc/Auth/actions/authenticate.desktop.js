import { oauthCreds } from '../Auth.config.js'
import { shell } from 'electron'
import querystring from 'querystring'

export default provider => (dispatch) => {
  if (oauthCreds[provider]) {
    const url = `${oauthCreds[provider].url}?${querystring.stringify(oauthCreds[provider].params)}`
    shell.openExternal(url)
  }
  return dispatch({
    type: 'AUTH/AUTHENTICATE',
    payload: {},

  })
}
