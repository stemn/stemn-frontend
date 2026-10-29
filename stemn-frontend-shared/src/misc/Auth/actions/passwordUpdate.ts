import { show as showToast } from 'stemn-shared/misc/Toasts/Toasts.actions.js'
import { replace } from 'stemn-shared/routing'
import type { StemnThunk } from 'stemn-shared/redux/types'
// import logout from './logout'

export interface IPasswordUpdateInput {
  oldPassword?: string
  newPassword: string
  /** From the password reset email */
  resetToken?: string
  /** Go to the home page afterwards */
  redirect?: boolean
}

// Either oldPassword or resetToken is required
export default ({ oldPassword, newPassword, resetToken, redirect }: IPasswordUpdateInput): StemnThunk<Promise<void>> =>
  (dispatch) =>
    dispatch({
      type: 'AUTH/PASSWORD_UPDATE',
      http: true,
      payload: {
        method: 'POST',
        url: '/api/v1/auth/changePassword',
        data: {
          oldPassword,
          newPassword,
          resetToken,
        },
      },
    }).then(() => {
      dispatch(showToast({ title: 'Great, your password has been updated.' }))
      if (redirect) {
        dispatch(replace('/'))
      }
      //  dispatch(logout('/'))
    })
