import http from 'axios'
import loadSession from './loadSession'

export default ({ email, password, firstname, lastname }) =>
  (dispatch) => {
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
      dispatch(loadSession())
    })
  }
