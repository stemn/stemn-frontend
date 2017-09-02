import loadUserData from './loadUserData'
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions.js'
import http from 'axios'

export default ({ email, password }) => (dispatch) => {
  dispatch({
    type: 'AUTH/LOGIN',
    payload: http({
      url: '/api/v1/auth/login',
      method: 'POST',
      data: {
        email,
        password,
      },
    }),
  }).then(({ value }) => {
    setTimeout(() => Promise.all([dispatch(loadUserData()), dispatch(getSettings())]), 1)
  })
}
