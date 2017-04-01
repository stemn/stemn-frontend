import { getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js';
import websocketJoinRoom from './websocketJoinRoom';
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
      dispatch(ProjectsActions.getUserProjects({userId: response.value.data._id}))
      dispatch(websocketJoinRoom({userId: response.value.data._id}))
    }).catch(error => {
//      dispatch(logout())
    })
  }
}