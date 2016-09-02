import http from 'axios';

export function newTask({projectId, task}) {
  return {
    type: 'TASKS/NEW_TASK',
    payload: http({
      method: 'PUT',
      url: `http://localhost:3000/api/v1/tasks/${projectId}`,
      data: task
    }),
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
          groups: ['Requirements', 'Development', 'Design'],
          items: [
            {
              _id: '1',
              title : 'Call Joan to discuss existing requirements',
              group: 'Requirements',
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
              group: 'Requirements',
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
              group: 'Requirements',
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
              group: 'Requirements',
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
              group: 'Development',
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
              group: 'Development',
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
              group: 'Development',
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
              group: 'Design',
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
              group: 'Design',
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
