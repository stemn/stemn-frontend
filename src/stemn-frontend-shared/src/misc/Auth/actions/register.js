import http from 'axios'
import loadUserData from './loadUserData'
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions.js'

export default ({ email, password, firstname, lastname }) => (dispatch) => {
  dispatch({
    type: 'AUTH/REGISTER',
    payload: http({
      url: '/api/v1/auth/register',
      method: 'POST',
      data: {
        email,
        password,
        firstname,
        lastname,
      },
    }),
  }).then(({ value }) => {
    setTimeout(() => Promise.all([dispatch(loadUserData()), dispatch(getSettings())]), 1)
  })
}
