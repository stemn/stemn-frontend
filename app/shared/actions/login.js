import http from 'axios';
import { push } from 'react-router-redux'

import * as AuthActions from './auth.js';

export const aliases = {};


export function loginUser({email, password}) {
  return {
    type:'LOGIN/SEND_LOGIN',
    http: true,
    payload: {
      url: 'https://stemn.com/api/v1/auth/login',
      method: 'POST',
      data: {
        email: email,
        password: password
      }
    }
//    then: ()=>{
//      console.log(AuthActions);
//    }
  }
}

//.then((response)=>{
//      dispatch(AuthActions.setAuthToken(response.data.token))
//      dispatch(AuthActions.initHttpHeaders('bearer ' + response.data.token))
//      dispatch(AuthActions.loadUserData())
//      setTimeout(()=>{dispatch(push('/'))}, 1)
//      return response
//    })
