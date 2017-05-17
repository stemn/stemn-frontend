import http from 'axios';
import { show } from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.actions.js';
import { oauthCreds } from '../Auth.config.js';
import setAuthToken from './setAuthToken'
import loadUserData from './loadUserData'
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions.js'

export default ({ provider, code }) => {
  return (dispatch) => {
    if(oauthCreds[provider]){
      dispatch({
        type: 'AUTH/POST_AUTHENTICATE',
        payload: http({
          method: 'POST',
          url: oauthCreds[provider].postUrl,
          data: {
            code: code,
            redirectUri: oauthCreds[provider].params.redirect_uri
          }
        })
      }).then(({value}) => {
        setTimeout(() => dispatch(show('main')), 100)
        dispatch(setAuthToken(value.data.token))
        return Promise.all([dispatch(loadUserData()), dispatch(getSettings())])
      })
    }
  }
}
