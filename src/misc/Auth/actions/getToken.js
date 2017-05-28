import setAuthToken from './setAuthToken'
import loadUserData from './loadUserData'
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions.js'

export default (token) => (dispatch) => dispatch({
  // Gets a long life token from a temp token
  type: 'AUTH/GET_TOKEN',
  http: true,
  payload: {
    url: '/api/v1/me/token',
    method: 'GET',
    headers: {
      Authorization: `bearer ${token}`,
    }
  }
}).then(({ value }) => {
    dispatch(setAuthToken(value.data.token))
    return Promise.all([dispatch(loadUserData()), dispatch(getSettings())])
})
