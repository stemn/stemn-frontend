export const GET_PROJECT = 'PROJECTS/GET_PROJECT';

export function getProject({projectId}) {
  return {
    type: GET_PROJECT,
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/projects/${projectId}`
    }
  };
}

export function addTeamMember({projectId, user}) {
  return {
    type: 'PROJECTS/ADD_TEAM_MEMBER',
    payload: {
      projectId,
      user
    }
  };
}

export function linkRemote({projectId, remoteType}) {
  return {
    type: 'PROJECTS/LINK_REMOTE',
    payload: {
      projectId,
      remoteType
    }
  };
}
