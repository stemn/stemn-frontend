import http from 'axios'
import { loadUserData } from './'
import { show as showToast } from '../../Toasts/Toasts.actions.js'
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions.js'

export default code => dispatch => dispatch({
  type: 'AUTH/SUBMIT_BETA_CODE',
  payload: http({
    url: '/api/v1/beta/signup',
    method: 'POST',
    data: {
      ref: code,
    },
  }),
}).then((response) => {
  setTimeout(() => Promise.all([dispatch(loadUserData()), dispatch(getSettings())]), 1)
  dispatch(showToast({ title: 'Beta access granted. Welcome to the Stemn Desktop Beta!' }))
})
