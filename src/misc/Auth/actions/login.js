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
      }).then((response)=>{
        dispatch(setAuthToken(response.data.token))
        setTimeout(()=>dispatch(loadUserData()), 1)
        setTimeout(()=>dispatch(getSettings()), 1)
        return response
      })
    })
  }
}
