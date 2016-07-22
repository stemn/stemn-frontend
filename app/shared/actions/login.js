import http from 'axios';

import * as AuthActions from './auth.js';

export function loginUser(creds) {
  return (dispatch) => {
    return {
        type:'LOGIN/SEND_LOGIN',
        payload: http({
            url: 'https://stemn.com/api/v1/auth/login',
            method: 'POST',
            data: {
              email: creds.email,
              password: creds.password
            }
        }).then((response)=>{
          dispatch(AuthActions.setAuthToken(response.data.token))
          dispatch(AuthActions.initHttpHeaders('bearer ' + response.data.token))
          dispatch(AuthActions.loadUserData())
          return response
        })
    }
  }
}
