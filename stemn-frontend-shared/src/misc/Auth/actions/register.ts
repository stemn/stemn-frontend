import http from 'axios'
import loadSession from './loadSession'
import type { StemnThunk } from 'stemn-shared/redux/types'
import type { ITokenResponse } from '../Auth.types'

export interface IRegisterInput {
  email: string
  password: string
  firstname: string
  lastname: string
}

export default ({ email, password, firstname, lastname }: IRegisterInput): StemnThunk =>
  (dispatch) => {
    dispatch({
      type: 'AUTH/REGISTER',
      payload: http<ITokenResponse>({
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
