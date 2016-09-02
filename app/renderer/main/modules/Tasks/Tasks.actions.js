import http from 'axios';
import getUuid from 'app/shared/helpers/getUuid.js';

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
          groups: [{
            _id: '1',
            name: 'Requirements'
          },{
            _id: '2',
            name: 'Development'
          },{
            _id: '3',
            name: 'Design'
          }],
          items: [
            {
              _id: '1',
              title : 'Call Joan to discuss existing requirements',
              group: '1',
              due: 1472792461569,
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            }, {
              _id: '2',
              title : 'Write new requirements based on feedback received from Sam',
              group: '1',
              due: 1472792461569,
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            }, {
              _id: '3',
              title : 'Create process flow based on user interview',
              group: '1',
              due: 1472792461569,
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            }, {
              _id: '4',
              title : 'Schedule meeting with client to go over documents from last week',
              group: '1',
              due: 1472792461569,
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            }, {
              _id: '5',
              title : 'Enable password recovery feature on the application',
              group: '2',
              due: 1472792461569,
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            }, {
              _id: '6',
              title : 'Create a build script to concatenate all javascript files for production',
              group: '2',
              due: 1472792461569,
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            }, {
              _id: '7',
              title : 'Add feature X to module Y',
              group: '2',
              due: 1472792461569,
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            }, {
              _id: '8',
              title : 'Talk to client about changing the look of the header',
              group: '3',
              due: 1472792461569,
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            }, {
              _id: '9',
              title : 'Get the new designs from Sam',
              group: '3',
              due: 1472792461569,
              users : [
                {
                  name: 'David Revay',
                  picture: '/uploads/e926ce6b-0e2c-44fb-822a-9c3cdaf29a55.jpeg'
                }
              ]
            }
          ]
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

export function moveTask({projectId, group, taskId, beforeId}) {
  return {
    type: 'TASKS/MOVE_TASK',
    payload: {
      projectId, group, taskId, beforeId
    },
    meta: {
      cacheKey: projectId
    }
  }
}

export function moveGroup({projectId, taskId}) {
  return {
    type: 'TASKS/MOVE_GROUP',
    meta: {
      cacheKey: projectId
    }
  }
}

export function newGroup({projectId, group}) {
  const groupDefault = {
    _id : getUuid(),
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
