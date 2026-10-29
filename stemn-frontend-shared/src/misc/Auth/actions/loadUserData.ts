import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { joinRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import http from 'axios'
import logout from './logout'
import type { StemnThunk } from 'stemn-shared/redux/types'
import type { IAuthUser } from '../Auth.types'

/** Loads the logged in user (AUTH/LOAD_USER_DATA), their projects, and joins their websocket room */
export default (): StemnThunk => (dispatch) => {
  dispatch({
    type: 'AUTH/LOAD_USER_DATA',
    payload: http<IAuthUser>({
      url: '/api/v1/me',
      method: 'GET',
    }),
  })
    .then((response) => {
      dispatch(getUserProjects({ userId: response.value.data._id }))
      dispatch(
        joinRoom({
          type: 'user',
          room: response.value.data._id,
        }),
      )
    })
    .catch((error: Error) => {
      if (error.toString().includes('401')) {
        // If 401, we logout
        dispatch(logout())
      }
    })
}
