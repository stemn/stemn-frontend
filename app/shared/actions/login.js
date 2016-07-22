import http from 'axios';
import * as AuthActions from './auth.js';

export const aliases = {};


export function loginUser(creds) {
  return {
    type:'ALIASED',
    payload: {
      email: creds.email,
      password: creds.password
    },
    meta: {
      trigger: 'LOGIN/SEND_LOGIN',
    },
  }
}

aliases['LOGIN/SEND_LOGIN'] = ({email, password}) => {
  return (dispatch) => {
    return {
      type:'LOGIN/SEND_LOGIN',
      payload: http({
        url: 'https://stemn.com/api/v1/auth/login',
        method: 'POST',
        data: {
          email: email,
          password: password
        }
      }).then((response)=>{
        dispatch(AuthActions.setAuthToken(response.data.token))
        dispatch(AuthActions.initHttpHeaders('bearer ' + response.data.token))
        dispatch(AuthActions.loadUserData())
        return response
      })
    }
  }
};
