import http from 'axios'
import { oauthCreds } from '../Auth.config'
import loadSession from './loadSession'
import type { ITokenResponse } from '../Auth.types'
import type { SendAuthToken } from './types'

const sendAuthToken: SendAuthToken =
  ({ provider, code }) =>
  (dispatch) => {
    if (oauthCreds[provider]) {
      return dispatch({
        type: 'AUTH/POST_AUTHENTICATE',
        payload: http<ITokenResponse>({
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

export default sendAuthToken
