import {  shell } from 'electron';
import { oauthCreds } from './Auth.config.js';
import querystring from 'querystring';
import http from 'axios';
import * as ProjectsActions from '../../actions/projects.js';
import * as ElectronWindowsActions from '../ElectronWindows/ElectronWindows.actions.js';
import { push } from 'react-router-redux';

export function loadUserData() {
  return (dispatch) => {
    dispatch({
      type:'AUTH/LOAD_USER_DATA',
      payload: http({
        url: `/api/v1/me`,
        method: 'GET',
      })
    }).then(response => {
      dispatch(ProjectsActions.getUserProjects({userId: response.value.data._id}))
      dispatch(websocketJoinRoom({userId: response.value.data._id}))
    }).catch(error => {
//      dispatch(logout())
    })
  }
}

export function sendAuthToken({ provider, code }) {
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
        }).then(response => {
          setTimeout(() => dispatch(ElectronWindowsActions.show('main')), 100)
          dispatch(setAuthToken(response.data.token))
          setTimeout(()=>dispatch(loadUserData()), 1)
          return response
        })
      })
    }
  }
}

export function authenticate(provider) {
  return (dispatch) => {
    if(oauthCreds[provider]){
      const url = oauthCreds[provider].url +'?'+ querystring.stringify(oauthCreds[provider].params);
      shell.openExternal(url)
    }
    return dispatch({
      type:'AUTH/AUTHENTICATE',
      payload: {}

    })
  }
}

export function unlink(provider) {
  return {
    type:'AUTH/UNLINK',
    payload: http({
      url: `/api/v1/auth/unlink/${provider}`,
      method: 'POST',
    })
  }
}

export function login({email, password}) {
  return (dispatch) => {
    dispatch({
      type:'AUTH/LOGIN',
      payload: http({
        url: '/api/v1/auth/login',
        method: 'POST',
        data: {
          email,
          password
        }
      }).then((response)=>{
        dispatch(setAuthToken(response.data.token))
        setTimeout(()=>dispatch(loadUserData()), 1)
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
        url: `/api/v1/auth/register`,
        method: 'POST',
        data: {
          email,
          password,
          firstname,
          lastname
        }
      }).then((response)=>{
        dispatch(setAuthToken(response.data.token))
        setTimeout(()=>dispatch(loadUserData()), 1)
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

export function logout() {
  return (dispatch, getState) => {
    dispatch({
      type:'AUTH/LOGOUT'
    })
    dispatch(push('/login'))
    dispatch(websocketLeaveRoom({
      userId: getState().auth.user._id
    }))
  }
}

export function websocketJoinRoom({userId}) {
  return {
    type: 'AUTH/WEBSOCKET_JOIN_ROOM',
    websocket: true,
    payload: {
      type : 'ROOM/JOIN',
      payload : {
        room : userId
      }
    }
  };
}
export function websocketLeaveRoom({userId}) {
  return {
    type: 'AUTH/WEBSOCKET_LEAVE_ROOM',
    websocket: true,
    payload: {
      type : 'ROOM/LEAVE',
      payload : {
        room : userId
      }
    }
  };
}
