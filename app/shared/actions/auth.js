import http from 'axios';
import { push } from 'react-router-redux'

import * as auth from 'app/main/modules/auth/auth.js';

export function loadUserData() {
  return {
    type:'AUTH/LOAD_USER_DATA',
    payload: http({
      url: 'https://stemn.com/api/v1/me',
      method: 'GET',
    }),
  }
}

export function authenticate(provider) {
  return (dispatch) => {
    dispatch({
      type:'AUTH/AUTHENTICATE',
      payload: auth.authenticate({
        provider
      }).then((response)=>{
        dispatch(setAuthToken(response.data.token))
        dispatch(initHttpHeaders('bearer ' + response.data.token))
        dispatch(loadUserData())
        setTimeout(()=>{dispatch(push('/'))}, 1)
        return response
      })
    })
  }
}

export function login({email, password}) {
  return (dispatch) => {
    dispatch({
      type:'AUTH/LOGIN',
      payload: http({
        url: 'https://stemn.com/api/v1/auth/login',
        method: 'POST',
        data: {
          email,
          password
        }
      }).then((response)=>{
        dispatch(setAuthToken(response.data.token))
        dispatch(initHttpHeaders('bearer ' + response.data.token))
        dispatch(loadUserData())
        setTimeout(()=>{dispatch(push('/'))}, 1)
        return response
      })
    })
  }
}

export function register({email, password, firstname, lastname}) {
  return (dispatch) => {
    dispatch({
      type:'AUTH/REGISTER',
      payload: http({
        url: 'http://localhost:3000/api/v1/auth/register',
        method: 'POST',
        data: {
          email,
          password,
          firstname,
          lastname
        }
      }).then((response)=>{
        dispatch(setAuthToken(response.data.token))
        dispatch(initHttpHeaders('bearer ' + response.data.token))
        dispatch(loadUserData())
        setTimeout(()=>{dispatch(push('/'))}, 1)
        return response
      })
    })
  }
}


export function setAuthToken(token) {
  return {
      type:'AUTH/SET_AUTH_TOKEN',
      payload: token
  }
}

export function removeAuthToken() {
  return {
      type:'AUTH/REMOVE_AUTH_TOKEN',
  }
}

export function initHttpHeaders(fullToken) {
  http.defaults.headers.common['Authorization'] = fullToken;
  return {
      type:'AUTH/INIT_HTTP_HEADER',
  }
}

export function removeHttpHeaders() {
  delete http.defaults.headers.common['Authorization'];
  return {
      type:'AUTH/REMOVE_HTTP_HEADER',
  }
}

export function clearUserData() {
  return {
      type:'AUTH/CLEAR_USER_DATA',
  }
}

export function logout() {
  return (dispatch) => {
    dispatch(clearUserData());
    dispatch(removeHttpHeaders());
    dispatch(removeAuthToken());
    setTimeout(()=>{dispatch(push('/login'))}, 1)
    dispatch({
        type:'AUTH/LOGOUT',
    })
  }
}
