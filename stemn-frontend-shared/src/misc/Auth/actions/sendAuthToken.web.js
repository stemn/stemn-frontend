import http from 'axios'
import { oauthCreds } from '../Auth.config.js'
import loadSession from './loadSession'

export default ({ provider, code }) =>
  (dispatch) => {
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
        dispatch(loadSession())
      })
    }
  }
