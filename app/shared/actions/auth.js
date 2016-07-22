import http from 'axios';
import {ipcRenderer} from 'electron';

export const aliases = {};

export function loadUserData() {
  return {
      type:'ALIASED',
      payload: {},
      meta: {
        trigger: 'AUTH/LOAD_USER_DATA_ALIAS',
      },
  }
}

export function loadUserDataAlias() {
  return {
      type:'AUTH/LOAD_USER_DATA_ALIAS',
      payload: http({
          url: 'https://stemn.com/api/v1/me',
          method: 'GET',
      })
  }
}

aliases['AUTH/LOAD_USER_DATA_ALIAS'] = loadUserDataAlias;


export function setAuthToken(token) {
  localStorage.setItem('token', token);
  return {
      type:'AUTH/SET_AUTH_TOKEN',
      payload: token
  }
}

export function removeAuthToken() {
  localStorage.removeItem('token');
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
