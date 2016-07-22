import http from 'axios';

export function getProjects() {
  return {
      type:'FETCH_PROJECTS',
      payload: http({
          url: 'https://stemn.com/api/v1/search',
          method: 'GET',
          params: {
              type:'project',
              parentType:'user',
              parentId:'547db55af7f342380174e228'
          },
      })
  }
}

export function toggleSidebar(status) {
  return {
      type:'TOGGLE_SIDEBAR',
      payload: status // If status exists, we set, otherwise we toggle
  }
}
