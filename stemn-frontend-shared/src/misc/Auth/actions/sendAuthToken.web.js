import http from 'axios'
import { oauthCreds } from '../Auth.config.js'
import loadUserData from './loadUserData'
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions.js'

export default ({ provider, code }) => (dispatch) => {
  if (oauthCreds[provider]) {
    return dispatch({
      type: 'AUTH/POST_AUTHENTICATE',
      payload: http({
        method: 'POST',
        url: oauthCreds[provider].postUrl,
        data: {
          code,
          redirectUri: oauthCreds[provider].params.redirect_uri,
        },
      }),
    }).then(({ value }) => {
      setTimeout(() => Promise.all([dispatch(loadUserData()), dispatch(getSettings())]), 1)
    })
  }
}
