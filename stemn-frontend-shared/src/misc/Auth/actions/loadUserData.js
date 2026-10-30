import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { joinRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import { loadMe } from 'stemn-shared/api/queries/me'
import logout from './logout'

/**
 * Loads the current user (GET /api/v1/me) into `auth.user`. The request goes through the TanStack
 * Query cache (the `me` query), whose legacy bridge writes `auth.user`; where there is no query client
 * (the Electron main process) the user is written here.
 */
export default () => (dispatch) => {
  dispatch({ type: 'AUTH/LOAD_USER_DATA_PENDING' })
  return loadMe()
    .then(({ user, synced }) => {
      if (!synced) dispatch({ type: 'AUTH/LOAD_USER_DATA_FULFILLED', payload: { data: user } })
      // The user's projects are still read from Redux by the desktop sidebar and the dashboard panel
      dispatch(getUserProjects({ userId: user._id }))
      dispatch(
        joinRoom({
          type: 'user',
          room: user._id,
        }),
      )
    })
    .catch((error) => {
      // No `response` in the payload: the failed query has already been toasted
      dispatch({
        type: 'AUTH/LOAD_USER_DATA_REJECTED',
        payload: { message: error && error.message, status: error && error.status },
        error: true,
      })
      if (error && error.status === 401) {
        // The token is no longer valid
        dispatch(logout())
      }
    })
}
