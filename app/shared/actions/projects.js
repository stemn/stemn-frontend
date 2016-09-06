import http from 'axios';
import { push } from 'react-router-redux'

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

export function createProject() {
  return (dispatch)=>{
    dispatch({
      type: 'PROJECTS/CREATE_PROJECT',
      payload: http({
        method: 'POST',
        url: `http://localhost:3000/api/v1/projects`,
        data: {}
      }).then((response)=>{
        dispatch(push(`/project/${response.data._id}/settings`))
      }).catch((response)=>{

      })
    });
  }
}

export function deleteProject({projectId}) {
  return (dispatch)=>{
    dispatch({
      type: 'PROJECTS/DELETE_PROJECT',
      payload: http({
        method: 'DELETE',
        url: `http://localhost:3000/api/v1/projects/${projectId}`,
      }).then((response)=>{
        dispatch(push(`/`))
      })
    });
  }
}

export function saveProject({project}) {
  return {
    type: 'PROJECTS/SAVE_PROJECT',
    payload: http({
      method: 'PUT',
      url: `http://localhost:3000/api/v1/projects/${project._id}`,
      data: project
    })
  }
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

export function linkRemote({projectId, provider, path, id}) {
  return {
    type: 'PROJECTS/LINK_REMOTE',
    payload: http({
      method: 'PUT',
      url: `http://localhost:3000/api/v1/remote/link/${projectId}/${provider}`,
      params: {
        path         : path,
        id           : id
      }
    }),
    meta: {
      cacheKey: projectId
    }
  };
}
