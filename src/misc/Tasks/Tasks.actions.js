import http                  from 'axios';
import getUuid               from 'stemn-shared/utils/getUuid.js';
import { actions }           from 'react-redux-form';
import { show as showToast } from '../Toasts/Toasts.actions.js';
import { showModal, showConfirm } from '../Modal/Modal.actions.js';
import { get }               from 'lodash';

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
      url: `/api/v1/boards/${boardId}/tasks`,
      data: Object.assign({}, taskDefault, task)
    }),
    meta: {
      cacheKey: boardId
    }
  })
 }
}

export function getBoards({projectId, populate}){
  return {
    type: 'TASKS/GET_BOARDS',
    payload: http({
      method: 'GET',
      url: `/api/v1/projects/${projectId}/boards`,
      params: {
        populate: populate || false
      }
    }),
    meta: {
      cacheKey: projectId
    }
  }
}

export function getBoard({boardId}){
  return {
    type: 'TASKS/GET_BOARD',
    payload: http({
      method: 'GET',
      url: `/api/v1/boards/${boardId}`,
      params: {
        populate: false
      }
    }),
    meta: {
      cacheKey: boardId
    }
  }
}

export function newEvent({taskId, event}){
  const eventObject = Object.assign({}, {
    _id: getUuid(),
  }, event);
  return {
    type: 'TASKS/NEW_EVENT',
    payload: {
      event: eventObject,
      taskId
    },
  }
}
export function deleteEvent({taskId, eventId}){
  return {
    type: 'TASKS/DELETE_EVENT',
    payload: {
      taskId,
      eventId
    }
  }
}

export function getEvents({taskId}){
  return {
    type: 'TASKS/GET_EVENTS',
    payload: http({
      method: 'GET',
      url: `/api/v1/tasks/${taskId}/events`,
    }),
    meta: {
      cacheKey: taskId
    }
  }
}

export function updateBoard({board}){
  return {
    type: 'TASKS/UPDATE_BOARD',
    payload: http({
      method: 'PUT',
      url: `/api/v1/boards/${board._id}`,
      data: board
    }),
    meta: {
      cacheKey: board._id
    }
  }
}

export function getTask({taskId}) {
  return {
    type: 'TASKS/GET_TASK',
    httpPackage: {
      endpoint: 'api/v1/tasks',
      url: `/api/v1/tasks`,
      method: 'GET',
      params: {
        'ids' : taskId
      }
    },
    meta: {
      cacheKey: taskId
    }
  }
}

export function updateTask({task}) {
  return {
    type: 'TASKS/UPDATE_TASK',
    http: true,
    throttle: {
      time: 2000,
      endpoint:  `TASKS/UPDATE_TASK-${task._id}`
    },
    payload: {
      method: 'PUT',
      url: `/api/v1/tasks/${task._id}`,
      data: task
    },
    meta: {
      cacheKey: task._id
    }
  }
}

export function getGroup({boardId, groupId}) {
  return {
    type: 'TASKS/GET_GROUP',
    http: true,
    payload: {
      method: 'GET',
      url: `api/v1/boards/${boardId}/groups/${groupId}`
    },
    meta: {
      boardId
    }
  }
}

export function updateGroup({group}) {
  return {
    type: 'TASKS/UPDATE_GROUP',
    http: true,
    throttle: {
      time: 2000,
      endpoint:  `TASKS/UPDATE_GROUP-${group._id}`
    },
    payload: {
      method: 'PUT',
      url: `/api/v1/groups/${group._id}`,
      data: group
    },
    meta: {
      cacheKey: group._id
    }
  }
}

export function deleteTask({boardId, taskId}) {
  return {
    type: 'TASKS/DELETE_TASK',
    payload: http({
      method: 'DELETE',
      url: `/api/v1/tasks/${taskId}`,
    }),
    meta: {
      taskId,
      boardId
    }
  }
}


export function moveTask({boardId, task, destinationTask, destinationGroup, after, save}) {
  // To move a task you must have either hoverItem or destinationGroup
  // destinationGroup is used if the group is empty
  return (dispatch) => {
    if(save){
      dispatch({
        type: 'TASKS/MOVE_TASK',
        payload: http({
          method: 'POST',
          url: `/api/v1/tasks/move`,
          data: {
            board: boardId,
            task,
            destinationGroup,
            destinationTask,
            after
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



export function moveGroup({boardId, group, destinationGroup, after, save}) {
  return (dispatch) => {
    if(save){
      dispatch({
        type: 'TASKS/MOVE_TASK',
        payload: http({
          method: 'POST',
          url: `/api/v1/groups/move`,
          data: {
            board: boardId,
            group,
            destinationGroup,
            after
          }
        })
      })
    }
    else {
      dispatch({
        type: 'TASKS/MOVE_GROUP',
        payload: {
          group, destinationGroup, boardId
        },
      })
    }
  }
}

export function toggleComplete({taskId, model, value}) {
  return (dispatch) => {
    dispatch(showToast({
      title: `This task was marked ${value ? 'complete' : 'incomplete'}.`,
      actions: [{
        text: 'Undo',
        action: {
          type: 'ALIASED',
          aliased: true,
          payload: {
            functionAlias: 'TasksActions.toggleCompleteUndo',
            functionInputs: { taskId, model, value }
          }
        }
      }]
    }));
  };
}
export function toggleCompleteUndo({taskId, model, value}) {
  return (dispatch, getState) => {
    dispatch(actions.change(model, !value));
    setTimeout(() => updateTask({task: getState().tasks.data[taskId].data}), 1)
  };
}

export function newGroup({boardId, group}) {
  return (dispatch)=>{
    if(group.name.length > 1){
      dispatch({
        type: 'TASKS/NEW_GROUP',
        payload: http({
          method: 'POST',
          url: `/api/v1/groups`,
          data: {
            ...group,
            board: boardId
          }
        }),
        meta: {
          boardId
        }
      })
    }
  }
}

export function deleteGroupConfirm({boardId, groupId}) {
  return showConfirm({
    message: 'Deleting a group is permanent. All tasks which belong to this group will be deleted (even archived tasks).',
    modalConfirm: {
      type: 'ALIASED',
      aliased: true,
      payload: {
        functionAlias: 'TasksActions.deleteGroup',
        functionInputs: { boardId, groupId }
      }
    }
  })
}
export function deleteGroup({boardId, groupId}) {
  return {
    type: 'TASKS/DELETE_GROUP',
    payload: http({
      method: 'DELETE',
      url: `/api/v1/boards/${boardId}/groups/${groupId}`,
    }),
    meta: {
      groupId,
      boardId
    }
  }
}

export function showLabelEditModal({boardId}) {
  return (dispatch) => {
    dispatch(showModal({
      modalType: 'TASK_LABELS',
      modalProps: {
        boardId
      },
    }))
  }
}

export function changeLayout({boardId, layout}) {
  return {
    type: 'TASKS/CHANGE_LAYOUT',
    payload: {
      boardId,
      layout
    }
  }
}
