import http from 'axios'
import { show as showToast } from '../Toasts/Toasts.actions.js'

export default () => dispatch => dispatch({
  type: 'AUTH/REQUEST_BETA_CODE',
  payload: http({
    url: '/api/v1/beta/request',
    method: 'GET',
  }),
}).then((response) => {
  dispatch(showToast({ title: 'Beta Code has been requested. We will contact you soon.' }))
})