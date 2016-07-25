import http from 'axios';

export const aliases = {};

export function getProjects(userId) {
  console.log(userId);
  return {
      type:'ALIASED',
      payload: {_id: userId},
      meta: {
        trigger: 'FETCH_PROJECTS',
      },
  }
}

aliases['FETCH_PROJECTS'] = (args) => {
  return {
    type:'FETCH_PROJECTS',
    payload: http({
      url: 'https://stemn.com/api/v1/search',
      method: 'GET',
      params: {
        type:'project',
        parentType:'user',
        parentId: args._id
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
