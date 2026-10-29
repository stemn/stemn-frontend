import loadSession from './loadSession'
import type { StemnThunk } from 'stemn-shared/redux/types'

/** Exchanges a temporary token (e.g. from an email link) for a long life token, then loads the session */
export default (token: string): StemnThunk<Promise<void>> =>
  (dispatch) =>
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
