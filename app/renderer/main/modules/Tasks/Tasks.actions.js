import http from 'axios';
import getUuid from 'app/shared/helpers/getUuid.js';
import { actions } from 'react-redux-form';
import { show as showToast } from 'app/renderer/main/modules/Toasts/Toasts.actions.js';

export function newTask({boardId, task}) {
  return (dispatch, getState) => {
   const taskDefault = {
    users: [{
      _id: getState().auth.user._id,
      name: getState().auth.user.name,
      picture: getState().auth.user.picture
    }]
  }
  dispatch({
    type: 'TASKS/NEW_TASK',
    payload: http({
      method: 'POST',
      url: `http://localhost:3000/api/v1/boards/${boardId}/tasks`,
      data: Object.assign({}, taskDefault, task)
    }),
    meta: {
      cacheKey: boardId
    }
  })
 }
}

export function getBoard({projectId}){
  return {
    type: 'TASKS/GET_BOARD',
    payload: http({
      method: 'GET',
      url: `http://localhost:3000/api/v1/boards`,
      params: {
        project: projectId
      }
    }),
    meta: {
      cacheKey: projectId
    }
  }
}

export function getTask({taskId}) {
  return {
    type: 'TASKS/GET_TASK',
    httpPackage: {
      endpoint: 'api/v1/tasks',
      url: `http://localhost:3000/api/v1/tasks`,
      method: 'GET',
      params: {
        'ids[]' : taskId
      }
    },
    meta: {
      cacheKey: taskId
    }
  }
}

export function deleteTask({boardId, taskId}) {
  return {
    type: 'TASKS/DELETE_TASK',
    payload: http({
      method: 'DELETE',
      url: `http://localhost:3000/api/v1/tasks/${taskId}`,
    }),
    meta: {
      taskId,
      boardId
    }
  }
}


export function moveTask({boardId, task, destinationTask, destinationGroup, save}) {
  // To move a task you must have either hoverItem or destinationGroup
  // destinationGroup is used if the group is empty
  return (dispatch) => {
    if(save){
      dispatch({
        type: 'TASKS/MOVE_TASK',
        payload: http({
          method: 'POST',
          url: `http://localhost:3000/api/v1/tasks/move`,
          data: {
            task,
            destinationGroup,
            destinationTask
          }
        }),
      })
    }
    else {
      dispatch({
        type: 'TASKS/MOVE_TASK',
        payload: {
          task,
          destinationGroup,
          destinationTask,
          boardId
        }
      })
    }
  }
}

//export function moveTask({boardId, task, destinationTask, destinationGroup}) {
//  // To move a task you must have either hoverItem or destinationGroup
//  // destinationGroup is used if the group is empty
//
//  return {
//    type: 'TASKS/MOVE_TASK',
//    payload: http({
//      method: 'POST',
//      url: `http://localhost:3000/api/v1/tasks/move`,
//      data: {
//        task,
//        destinationGroup,
//        destinationTask
//      }
//    }),
//    meta: {
//      task,
//      destinationGroup,
//      destinationTask,
//      boardId
//    }
//  }
//}

export function beginDrag({boardId, taskId}) {
  return {
    type: 'TASKS/BEGIN_DRAG',
    payload: {
      taskId
    },
    meta: {
      cacheKey: boardId
    }
  }
}

export function endDrag({boardId, taskId}) {
  return {
    type: 'TASKS/END_DRAG',
    payload: {
      taskId
    },
    meta: {
      cacheKey: boardId
    }
  }
}



export function moveGroup({boardId, dragItem, hoverItem}) {
  return {
    type: 'TASKS/MOVE_GROUP',
    payload: {
      dragItem, hoverItem, boardId
    },
  }
}


export function toggleComplete({taskId, model, value}) {
  return (dispatch) => {
    dispatch(actions.change(model, value));
    dispatch(showToast({
      title: `This task was marked ${value ? 'complete' : 'incomplete'}.`,
      actions: [{
        text: 'Undo',
        action: actions.change(model, !value)
      }]
    }));
  };
}

export function newGroup({boardId, group}) {
  return (dispatch)=>{
    if(group.name.length > 1){
      dispatch({
        type: 'TASKS/NEW_GROUP',
        payload: http({
          method: 'POST',
          url: `http://localhost:3000/api/v1/boards/${boardId}/groups`,
          data: group
        }),
        meta: {
          boardId
        }
      })
    }
  }
}

export function deleteGroup({boardId, groupId}) {
  return {
    type: 'TASKS/DELETE_GROUP',
    payload: http({
      method: 'DELETE',
      url: `http://localhost:3000/api/v1/taskGroups/${groupId}`,
    }),
    meta: {
      groupId,
      boardId
    }
  }
}


