import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js';
import { joinRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'
import http from 'axios';

export default () => {
  return (dispatch) => {
    dispatch({
      type:'AUTH/LOAD_USER_DATA',
      payload: http({
        url: `/api/v1/me`,
        method: 'GET',
      })
    }).then(response => {
      dispatch(getUserProjects({userId: response.value.data._id}))
      dispatch(joinRoom({
        type: 'user',
        room: response.value.data._id
      }))
    }).catch(error => {
//      dispatch(logout())
    })
  }
}
