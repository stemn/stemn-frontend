import { leaveRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import { loginRoute } from 'route-actions'
import { push } from 'react-router-redux'
import { storeChange } from 'stemn-shared/misc/Store/Store.actions.js'

export default () => (dispatch, getState) => {
  dispatch({ type: 'AUTH/LOGOUT' })
  dispatch(push(loginRoute()))
  dispatch(leaveRoom({
    room: getState().auth.user._id,
    type: 'user',
  }))
  // Clear all data
  dispatch(storeChange('', undefined))
}
