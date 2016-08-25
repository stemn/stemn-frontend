export function getProjects({userId}) {
  return {
    type:'FETCH_PROJECTS',
    http: true,
    payload: {
      url: 'http://localhost:3000/api/v1/search',
      method: 'GET',
      params: {
        type:'project',
        parentType:'user',
        parentId: userId,
        size: 50,
      },
    },
  }
}

export function toggleSidebar(status) {
  return {
      type:'TOGGLE_SIDEBAR',
      payload: status // If status exists, we set, otherwise we toggle
  }
}
