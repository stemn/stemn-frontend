import { show as showToast } from 'stemn-shared/misc/Toasts/Toasts.actions.js'
import { replace } from 'react-router-redux'
// import logout from './logout'

// Either oldPassword or resetToken is required
export default ({ oldPassword, newPassword, resetToken, redirect }) => dispatch => dispatch({
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
