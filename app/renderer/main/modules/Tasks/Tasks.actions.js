import http from 'axios';
import getUuid from 'app/shared/helpers/getUuid.js';
import { actions } from 'react-redux-form';
import { show as showToast } from 'app/renderer/main/modules/Toasts/Toasts.actions.js';

export function newTask({projectId, task}) {
  const taskDefault = {
    _id : getUuid(),
    users: [{
      name: 'David Revay',
      picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
    }]
  }
  return {
    type: 'TASKS/NEW_TASK',
//    payload: http({
//      method: 'PUT',
//      url: `http://localhost:3000/api/v1/tasks/${projectId}`,
//      data: task
//    }),
    payload: {
      projectId,
      task: Object.assign({}, taskDefault, task)
    },
    meta: {
      cacheKey: projectId
    }
  }
}


export function getTasks({projectId}) {
  return {
    type: 'TASKS/GET_TASKS',
//    payload: http({
//      method: 'GET',
//      url: `http://localhost:3000/api/v1/tasks/${projectId}`,
//    }),
    payload: {
      response: {
        data: {
          structure: [
            {
              _id: 'G1',
              name: 'Requirements',
              children: [{_id: 'T1'}, {_id: 'T2'}, {_id: 'T3'}, {_id: 'T4'}]
            },{
              _id: 'G2',
              name: 'Development',
              children: [{_id: 'T5'}, {_id:'T6'}, {_id: 'T7'}]
            },{
              _id: 'G3',
              name: 'Design',
              children: [{_id: 'T8'}, {_id: 'T9'}]
            }
          ],
          items: {
            T1: {
              _id: 'T1',
              title : 'Call Joan to discuss existing requirements',
              group: '1',
              due: 1472792461569,
              project: {
                _id: '57c3c23692b46d982beaadd6'
              },
              labels: ['L1', 'L2', 'L4'],
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            },
            T2: {
              _id: 'T2',
              title : 'Write new requirements based on feedback received from Sam',
              group: '1',
              labels: ['L2', 'L4'],
              due: 1472792461569,
              project: {
                _id: '57c3c23692b46d982beaadd6'
              },
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            },
            T3: {
              _id: 'T3',
              title : 'Create process flow based on user interview',
              group: '1',
              labels: ['L4', 'L2'],
              due: 1472792461569,
              project: {
                _id: '57c3c23692b46d982beaadd6'
              },
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            },
            T4: {
              _id: 'T4',
              title : 'Schedule meeting with client to go over documents from last week',
              group: '1',
              due: 1472792461569,
              project: {
                _id: '57c3c23692b46d982beaadd6'
              },
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            },
            T5: {
              _id: 'T5',
              title : 'Enable password recovery feature on the application',
              group: '2',
              due: 1472792461569,
              project: {
                _id: '57c3c23692b46d982beaadd6'
              },
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            },
            T6: {
              _id: 'T6',
              title : 'Create a build script to concatenate all javascript files for production',
              group: '2',
              due: 1472792461569,
              project: {
                _id: '57c3c23692b46d982beaadd6'
              },
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            },
            T7: {
              _id: 'T7',
              title : 'Add feature X to module Y',
              group: '2',
              due: 1472792461569,
              project: {
                _id: '57c3c23692b46d982beaadd6'
              },
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            },
            T8: {
              _id: 'T8',
              title : 'Talk to client about changing the look of the header',
              group: '3',
              due: 1472792461569,
              project: {
                _id: '57c3c23692b46d982beaadd6'
              },
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            },
            T9: {
              _id: 'T9',
              title : 'Get the new designs from Sam',
              group: '3',
              due: 1472792461569,
              project: {
                _id: '57c3c23692b46d982beaadd6'
              },
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            }
          }
        }
      }
    },
    meta: {
      cacheKey: projectId
    }
  }
}

export function deleteTask({projectId, taskId}) {
  return {
    type: 'TASKS/DELETE_TASK',
    payload: http({
      method: 'DELETE',
      url: `http://localhost:3000/api/v1/tasks/${projectId}/${taskId}`,
    }),
    meta: {
      cacheKey: projectId
    }
  }
}

//export function moveTask({projectId, lastX, lastY, nextX, nextY}) {
//  return {
//    type: 'TASKS/MOVE_TASK',
//    payload: {
//      lastX, lastY, nextX, nextY
//    },
//    meta: {
//      cacheKey: projectId
//    }
//  }
//}
//
//
//export function moveGroup({projectId, lastX, nextX}) {
//  return {
//    type: 'TASKS/MOVE_GROUP',
//    payload: {
//      lastX, nextX
//    },
//    meta: {
//      cacheKey: projectId
//    }
//  }
//}


export function moveTask({projectId, dragItem, hoverItem}) {
  return {
    type: 'TASKS/MOVE_TASK',
    payload: {
      dragItem, hoverItem
    },
    meta: {
      cacheKey: projectId
    }
  }
}


export function moveGroup({projectId, dragItem, hoverItem}) {
  return {
    type: 'TASKS/MOVE_GROUP',
    payload: {
      dragItem, hoverItem
    },
    meta: {
      cacheKey: projectId
    }
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

export function newGroup({projectId, group}) {
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
          cacheKey: projectId
        }
      })
    }
  }
}

export function deleteGroup({projectId, group}) {
  return {
    type: 'TASKS/DELETE_GROUP',
    payload: {
      group
    },
    meta: {
      cacheKey: projectId
    }
  }
}


