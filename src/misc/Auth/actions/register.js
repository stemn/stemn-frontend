import http from 'axios';
import { setAuthToken, loadUserData } from './';
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions.js'

export default ({email, password, firstname, lastname}) => {
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
      })
    }).then(({ value })=>{
      dispatch(setAuthToken(value.data.token))
      return Promise.all([dispatch(loadUserData()), dispatch(getSettings())])
    })
  }
}
