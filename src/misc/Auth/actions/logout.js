import websocketLeaveRoom from './websocketLeaveRoom'
import { loginRoute } from 'route-actions'
import { push } from 'react-router-redux'

export default () => (dispatch, getState) => {
  dispatch({ type: 'AUTH/LOGOUT' })
  dispatch(push(loginRoute()))
  dispatch(websocketLeaveRoom({ userId: getState().auth.user._id }))
}
