import { leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import { loginRoute } from 'route-actions'
import { push } from 'stemn-shared/routing'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions.js'
import type { StemnThunk } from 'stemn-shared/redux/types'

export default (): StemnThunk => (dispatch, getState) => {
  dispatch({ type: 'AUTH/LOGOUT' })
  dispatch(push(loginRoute()))
  dispatch(
    leaveRoom({
      // Note: AUTH/LOGOUT has already reset the user, so the id is undefined here and the user room is never
      // left (pre-existing behaviour, kept as is; see docs/TYPESCRIPT.md)
      room: getState().auth.user._id as string,
      type: 'user',
    }),
  )
  // Clear all data
  dispatch(storeChange('', undefined))
}
