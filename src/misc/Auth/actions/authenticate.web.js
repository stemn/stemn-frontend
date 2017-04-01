import { oauthCreds } from '../Auth.config.js';
import querystring from 'querystring';

export default (provider) => {
  return (dispatch) => {
    if(oauthCreds[provider]){
      const url = oauthCreds[provider].url +'?'+ querystring.stringify(oauthCreds[provider].params);
      console.log('DO SOME STUFF');
    }
    return dispatch({
      type:'AUTH/AUTHENTICATE',
      payload: {}

    })
  }
}
