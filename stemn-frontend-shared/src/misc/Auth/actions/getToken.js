import loadSession from './loadSession'

export default (token) => (dispatch) =>
  dispatch({
    // Gets a long life token from a temp token
    type: 'AUTH/GET_TOKEN',
    http: true,
    payload: {
      url: '/api/v1/me/token',
      method: 'GET',
      headers: {
        Authorization: `bearer ${token}`,
      },
    },
  }).then(({ value }) => {
    dispatch(loadSession())
  })
