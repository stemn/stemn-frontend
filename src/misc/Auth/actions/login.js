import http from 'axios';
import loadUserData from './loadUserData';
import setAuthToken from './setAuthToken';
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions.js'


export default ({email, password}) => {
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
      })
    }).then(({ value })=>{
      dispatch(setAuthToken(value.data.token))
      return Promise.all([dispatch(loadUserData()), dispatch(getSettings())])
    })
  }
}
