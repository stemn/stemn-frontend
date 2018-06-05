import http from 'axios'
import { show } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { oauthCreds } from '../Auth.config.js'
import loadUserData from './loadUserData'
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions.js'

export default ({ provider, code }) => (dispatch) => {
  if (oauthCreds[provider]) {
    dispatch({
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
      setTimeout(() => dispatch(show('main')), 100)
      setTimeout(() => Promise.all([dispatch(loadUserData()), dispatch(getSettings())]), 1)
    })
  }
}
