import websocketLeaveRoom from './websocketLeaveRoom';
import { loginRoute } from 'route-actions';
import { push } from 'react-router-redux';

export default () => {
  return (dispatch, getState) => {
    dispatch({
      type:'AUTH/LOGOUT'
    })
    dispatch(loginRoute())
    dispatch(websocketLeaveRoom({
      userId: getState().auth.user._id
    }))
  }
}