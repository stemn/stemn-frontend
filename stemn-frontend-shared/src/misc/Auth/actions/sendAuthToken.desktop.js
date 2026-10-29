import http from 'axios'
import { show } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { oauthCreds } from '../Auth.config.js'
import loadSession from './loadSession'

export default ({ provider, code }) =>
  (dispatch) => {
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
        dispatch(loadSession())
      })
    }
  }
