import http from 'axios';
import { oauthCreds } from '../Auth.config.js';
import setAuthToken from './setAuthToken'
import loadUserData from './loadUserData'

export default ({ provider, code }) => (dispatch) => {
  if(oauthCreds[provider]){
    return dispatch({
      type: 'AUTH/POST_AUTHENTICATE',
      payload: http({
        method: 'POST',
        url: oauthCreds[provider].postUrl,
        data: {
          code: code,
          redirectUri: oauthCreds[provider].params.redirect_uri
        }
      }).then(response => {
        dispatch(setAuthToken(response.data.token))
        setTimeout(()=>dispatch(loadUserData()), 1)
        return response
      })
    })
  }
}
