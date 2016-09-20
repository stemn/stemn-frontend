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
    payload: http({
      method: 'GET',
      url: `http://localhost:3000/api/v1/tasks/${taskId}`,
    }),
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
      cacheKey: boardId
    }
  }
}


export function moveTask({boardId, dragItem, hoverItem, destinationGroup}) {
  // To move a task you must have either hoverItem or destinationGroup
  // destinationGroup is used if the group is empty

  return {
    type: 'TASKS/MOVE_TASK',
    payload: http({
      method: 'POST',
      url: `http://localhost:3000/api/v1/tasks/move`,
      data: {
        task : dragItem.id,
        destinationGroup,
        destinationTask : hoverItem ? hoverItem.id : ''
      }
    }),
    meta: {
      task : dragItem.id,
      destinationGroup,
      destinationTask : hoverItem ? hoverItem.id : '',
      boardId
    }
  }

//  return {
//    type: 'TASKS/MOVE_TASK',
//    payload: {
//      dragItem, hoverItem, destinationGroup, boardId
//    },
//  }
}

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
  const groupDefault = {
    _id : getUuid(),
    children: []
  }
  return (dispatch)=>{
    if(group.name.length > 1){
      dispatch({
        type: 'TASKS/NEW_GROUP',
        payload: {
          group: Object.assign({}, groupDefault, group)
        },
        meta: {
          cacheKey: boardId
        }
      })
    }
  }
}

export function deleteGroup({boardId, groupId}) {
  return {
    type: 'TASKS/DELETE_GROUP',
    payload: {
      groupId
    },
    meta: {
      cacheKey: boardId
    }
  }
}


