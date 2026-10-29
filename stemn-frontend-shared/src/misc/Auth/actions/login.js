import loadSession from './loadSession'
import http from 'axios'

export default ({ email, password }) =>
  (dispatch) => {
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
      dispatch(loadSession())
    })
  }
