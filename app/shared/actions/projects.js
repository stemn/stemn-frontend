import http from 'axios';

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

export function changeUserPermissions({projectId, userId, role}) {
  return {
    type: 'PROJECTS/CHANGE_USER_PERMISSIONS',
    payload: {
      projectId,
      userId,
      role
    }
  };
}

export function removeTeamMember({projectId, userId}) {
  return {
    type: 'PROJECTS/REMOVE_TEAM_MEMBER',
    payload: {
      projectId,
      userId,
    }
  };
}

export function linkRemote({projectId, provider, path_display, path, id}) {
  return {
    type: 'PROJECTS/LINK_REMOTE',
    payload: http({
      method: 'PUT',
      url: `http://localhost:3000/api/v1/remote/link/${projectId}/${provider}`,
      params: {
        path_display : path_display,
        path         : path,
        id           : id
      }
    }),
    meta: {
      cacheKey: projectId
    }
  };
}
