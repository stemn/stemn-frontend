import http from 'axios';
import { storeChange } from 'stemn-shared/misc/Store/Store.actions';
import threadLabelsEditModalName from 'stemn-shared/misc/Threads/ThreadLabelsEditModal';
import { pickId } from 'stemn-shared/utils/pickId.js';

import { showConfirm, showModal } from '../Modal/Modal.actions.js';
import { show as showToast } from '../Toasts/Toasts.actions.js';

//        return dispatch(addEvent({
//          cacheKey: timelineCacheKey,
//          event: {
//            event: 'comment',
//            timestamp: value.data.timestamp,
//            user: {
//              name: currentUser.name,
//              _id: currentUser._id,
//              picture: currentUser.picture,
//            },
//            data: {
//              comment: value.data._id
//            }
//          }
//        }))

export function newThread({ projectId, thread }) {
  return (dispatch, getState) => {
    const threadDefault = {
      users: [getState().auth.user._id],
    }
    return dispatch({
      type: 'THREADS/NEW_TASK',
      payload: http({
        method: 'POST',
        url: `/api/v1/projects/${projectId}/threads`,
        data: Object.assign({}, threadDefault, thread),
      }),
      meta: {
        cacheKey: projectId,
      },
    })
  }
}

export function getBoards({ projectId, populate }) {
  return {
    type: 'THREADS/GET_BOARDS',
    payload: http({
      method: 'GET',
      url: `/api/v1/projects/${projectId}/boards`,
      params: {
        populate: populate || false,
      },
    }),
    meta: {
      cacheKey: projectId,
    },
  }
}

export function getBoard({ boardId }) {
  return {
    type: 'THREADS/GET_BOARD',
    payload: http({
      method: 'GET',
      url: `/api/v1/boards/${boardId}`,
      params: {
        populate: false,
      },
    }),
    meta: {
      cacheKey: boardId,
    },
  }
}


// export function getEvents({threadId}){
//  return {
//    type: 'THREADS/GET_EVENTS',
//    payload: http({
//      method: 'GET',
//      url: `/api/v1/threads/${threadId}/events`,
//    }),
//    meta: {
//      cacheKey: threadId
//    }
//  }
// }

export const updateBoard = ({ board }) => ({
  type: 'THREADS/UPDATE_BOARD',
  payload: http({
    method: 'PUT',
    url: `/api/v1/boards/${board._id}`,
    data: board,
  }),
  meta: {
    cacheKey: board._id,
  },
})


export const editBoard = ({ model, value }) => ({
  type: 'THREADS/EDIT_BOARD',
  payload: board,
})

export function getThread({ threadId }) {
  return {
    type: 'THREADS/GET_TASK',
    httpPackage: {
      url: '/api/v1/threads',
      method: 'GET',
      params: {
        ids: threadId,
      },
    },
    meta: {
      cacheKey: threadId,
    },
  }
}

export const updateThread = ({ thread }) => (dispatch, getState) => dispatch({
  type: 'THREADS/UPDATE_TASK',
  http: true,
  throttle: {
    time: 2000,
    endpoint: `THREADS/UPDATE_TASK-${thread._id}`,
  },
  payload: {
    method: 'PUT',
    url: `/api/v1/threads/${thread._id}`,
    data: {
      ...thread,
      owner: pickId(thread.owner),
      project: pickId(thread.project),
      users: thread.users.map(pickId),
    },
  },
  meta: {
    cacheKey: thread._id,
  },
})

export function getGroup({ boardId, groupId }) {
  return {
    type: 'THREADS/GET_GROUP',
    http: true,
    payload: {
      method: 'GET',
      url: `api/v1/boards/${boardId}/groups/${groupId}`,
    },
    meta: {
      boardId,
    },
  }
}

export function updateGroup({ group }) {
  return {
    type: 'THREADS/UPDATE_GROUP',
    http: true,
    throttle: {
      time: 2000,
      endpoint: `THREADS/UPDATE_GROUP-${group._id}`,
    },
    payload: {
      method: 'PUT',
      url: `/api/v1/groups/${group._id}`,
      data: group,
    },
    meta: {
      cacheKey: group._id,
    },
  }
}

export function deleteThread({ boardId, threadId }) {
  return {
    type: 'THREADS/DELETE_TASK',
    payload: http({
      method: 'DELETE',
      url: `/api/v1/threads/${threadId}`,
    }),
    meta: {
      threadId,
      boardId,
    },
  }
}


export function moveThread({ boardId, thread, destinationThread, destinationGroup, after, save }) {
  // To move a thread you must have either hoverItem or destinationGroup
  // destinationGroup is used if the group is empty
  return (dispatch) => {
    if (save) {
      dispatch({
        type: 'THREADS/MOVE_TASK',
        payload: http({
          method: 'POST',
          url: `/api/v1/threads/${thread}/move`,
          data: {
            boardId,
            threadId: thread,
            destinationGroupId: destinationGroup,
            destinationThreadId: destinationThread,
            after,
          },
        }),
      })
    } else {
      dispatch({
        type: 'THREADS/MOVE_TASK',
        payload: {
          thread,
          destinationGroup,
          destinationThread,
          boardId,
        },
      })
    }
  }
}

export function beginDrag({ boardId, threadId }) {
  return {
    type: 'THREADS/BEGIN_DRAG',
    payload: {
      threadId,
    },
    meta: {
      cacheKey: boardId,
    },
  }
}

export function endDrag({ boardId, threadId }) {
  return {
    type: 'THREADS/END_DRAG',
    payload: {
      threadId,
    },
    meta: {
      cacheKey: boardId,
    },
  }
}


export function moveGroup({ boardId, group, destinationGroup, after, save }) {
  return (dispatch) => {
    if (save) {
      dispatch({
        type: 'THREADS/MOVE_GROUP',
        payload: http({
          method: 'POST',
          url: '/api/v1/groups/move',
          data: {
            board: boardId,
            group,
            destinationGroup,
            after,
          },
        }),
      })
    } else {
      dispatch({
        type: 'THREADS/MOVE_GROUP',
        payload: {
          group, destinationGroup, boardId,
        },
      })
    }
  }
}

export function toggleComplete({ threadId, model, value }) {
  return (dispatch) => {
    dispatch(showToast({
      title: `This thread was marked as ${value ? 'closed' : 'open'}.`,
      actions: [{
        text: 'Undo',
        action: {
          type: 'ALIASED',
          aliased: true,
          payload: {
            functionAlias: 'ThreadsActions.toggleCompleteUndo',
            functionInputs: { threadId, model, value },
          },
        },
      }],
    }))
  }
}
export function toggleCompleteUndo({ threadId, model, value }) {
  return (dispatch, getState) => {
    dispatch(storeChange(model, !value))
    setTimeout(() => updateThread({ thread: getState().threads.data[threadId].data }), 1)
  }
}

export function newGroup({ boardId, group }) {
  return (dispatch) => {
    if (group.name.length > 1) {
      dispatch({
        type: 'THREADS/NEW_GROUP',
        payload: http({
          method: 'POST',
          url: '/api/v1/groups',
          data: {
            ...group,
            board: boardId,
          },
        }),
        meta: {
          boardId,
        },
      })
    }
  }
}

export const deleteGroupConfirm = ({ boardId, groupId }) => dispatch => dispatch(showConfirm({
  message: 'Deleting a group is permanent. All threads which belong to this group will be deleted (even archived threads).',
})).then(() => {
  dispatch(deleteGroup({ boardId, groupId }))
})

export function deleteGroup({ boardId, groupId }) {
  return {
    type: 'THREADS/DELETE_GROUP',
    payload: http({
      method: 'DELETE',
      url: `/api/v1/boards/${boardId}/groups/${groupId}`,
    }),
    meta: {
      groupId,
      boardId,
    },
  }
}

export function showLabelEditModal({ boardId }) {
  return (dispatch) => {
    dispatch(showModal({
      modalType: threadLabelsEditModalName,
      modalProps: {
        boardId,
      },
    }))
  }
}

export function changeLayout({ boardId, layout }) {
  return {
    type: 'THREADS/CHANGE_LAYOUT',
    payload: {
      boardId,
      layout,
    },
  }
}
