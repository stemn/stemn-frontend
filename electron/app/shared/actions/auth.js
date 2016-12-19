//import http from 'axios';
//import * as auth from '../../main/modules/auth/auth.js';
//import * as ProjectsActions from './projects.js';
//
//export function loadUserData() {
//  return (dispatch) => {
//    dispatch({
//      type:'AUTH/LOAD_USER_DATA',
//      payload: http({
//        url: `/api/v1/me`,
//        method: 'GET',
//      })
//    }).then(response => {
//      dispatch(ProjectsActions.getUserProjects({userId: response.value.data._id}))
//    }).catch(error => {
//      dispatch(logout())
//    })
//  }
//}
//
//export function sendAuthToken({url, code}) {
//  return {
//    type: 'AUTH/SEND_AUTH_TOKEN',
//    payload: http({
//      method: 'POST',
//      url: url,
//      data: {
//        code: code
//      }
//    })
//  }
//}
//
//export function authenticate(provider) {
//  return (dispatch) => {
//    return dispatch({
//      type:'AUTH/AUTHENTICATE',
//      payload: auth.authenticate({
//        provider
//      }).then((response)=>{
//        dispatch(setAuthToken(response.data.token))
//        dispatch(initHttpHeaders(response.data.token))
//        setTimeout(()=>dispatch(loadUserData()), 1)
//        return response
//      })
//    })
//  }
//}
//
//export function unlink(provider) {
//  return {
//    type:'AUTH/UNLINK',
//    payload: http({
//      url: `/api/v1/auth/unlink/${provider}`,
//      method: 'POST',
//    })
//  }
//}
//
//export function login({email, password}) {
//  return (dispatch) => {
//    dispatch({
//      type:'AUTH/LOGIN',
//      payload: http({
//        url: '/api/v1/auth/login',
//        method: 'POST',
//        data: {
//          email,
//          password
//        }
//      }).then((response)=>{
//        dispatch(setAuthToken(response.data.token))
//        dispatch(initHttpHeaders(response.data.token))
//        setTimeout(()=>dispatch(loadUserData()), 1)
//        return response
//      })
//    })
//  }
//}
//
//export function register({email, password, firstname, lastname}) {
//  return (dispatch) => {
//    dispatch({
//      type:'AUTH/REGISTER',
//      payload: http({
//        url: `/api/v1/auth/register`,
//        method: 'POST',
//        data: {
//          email,
//          password,
//          firstname,
//          lastname
//        }
//      }).then((response)=>{
//        dispatch(setAuthToken(response.data.token))
//        dispatch(initHttpHeaders(response.data.token))
//        setTimeout(()=>dispatch(loadUserData()), 1)
//        return response
//      })
//    })
//  }
//}
//
//export function setAuthToken(token) {
//
//  return {
//    type:'AUTH/SET_AUTH_TOKEN',
//    payload: token
//  }
//}
//
//export function removeAuthToken() {
//  return {
//    type:'AUTH/REMOVE_AUTH_TOKEN',
//  }
//}
//
//export function initHttpHeaders(token) {
//  return (dispatch, getState) => {
//    token = token || getState().auth.authToken
//    const fullToken = token ? 'bearer '+ token : '';
//    dispatch({
//      type:'AUTH/INIT_HTTP_HEADER',
//      payload: { fullToken }
//    })
//  }
//}
//
//export function removeHttpHeaders() {
//  return {
//    type:'AUTH/REMOVE_HTTP_HEADER',
//  }
//}
//
//export function clearUserData() {
//  return {
//    type:'AUTH/CLEAR_USER_DATA',
//  }
//}
//
//export function logout() {
//  return (dispatch) => {
//    dispatch(clearUserData());
//    dispatch(removeHttpHeaders());
//    dispatch(removeAuthToken());
//    dispatch({
//        type:'AUTH/LOGOUT',
//    })
//  }
//}
