import { show as showToast } from 'stemn-shared/misc/Toasts/Toasts.actions.js'
import { replace } from 'react-router-redux'

export default ({ oldPassword, newPassword, resetToken }) => (dispatch) => dispatch({
  type: 'AUTH/PASSWORD_UPDATE',
  http: true,
  payload: {
    method: 'POST',
    url: '/api/v1/auth/changePassword',
    data: {
      oldPassword,
      newPassword,
      resetToken,
    }
  }
}).then(() => {
  dispatch(showToask({ title: 'Great, your password has been updated.' }))
  dispatch(replace('/'))
})
