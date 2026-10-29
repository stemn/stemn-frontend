import loadSession from './loadSession'
import http from 'axios'
import { show as showToast } from '../../Toasts/Toasts.actions.js'
import type { StemnThunk } from 'stemn-shared/redux/types'

export default (code: string): StemnThunk<Promise<void>> =>
  (dispatch) =>
    dispatch({
      type: 'AUTH/SUBMIT_BETA_CODE',
      payload: http({
        url: '/api/v1/beta/signup',
        method: 'POST',
        data: {
          ref: code,
        },
      }),
    }).then((response) => {
      dispatch(loadSession())
      dispatch(showToast({ title: 'Beta access granted. Welcome to the Stemn Desktop Beta!' }))
    })
