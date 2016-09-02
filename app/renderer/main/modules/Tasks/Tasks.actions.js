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
    payload: http({
      method: 'GET',
      url: `http://localhost:3000/api/v1/tasks/${projectId}`,
    }),
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



