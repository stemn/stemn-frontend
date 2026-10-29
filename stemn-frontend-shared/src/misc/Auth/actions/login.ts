import loadSession from './loadSession'
import http from 'axios'
import type { StemnThunk } from 'stemn-shared/redux/types'
import type { ITokenResponse } from '../Auth.types'

export default ({ email, password }: { email: string; password: string }): StemnThunk =>
  (dispatch) => {
    dispatch({
      type: 'AUTH/LOGIN',
      payload: http<ITokenResponse>({
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
