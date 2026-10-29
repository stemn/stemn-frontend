import http from 'axios'
import { show } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js'
import { oauthCreds } from '../Auth.config'
import loadSession from './loadSession'
import type { ITokenResponse } from '../Auth.types'
import type { SendAuthToken } from './types'

const sendAuthToken: SendAuthToken =
  ({ provider, code }) =>
  (dispatch) => {
    if (oauthCreds[provider]) {
      dispatch({
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
        setTimeout(() => dispatch(show('main')), 100)
        dispatch(loadSession())
      })
    }
  }

export default sendAuthToken
