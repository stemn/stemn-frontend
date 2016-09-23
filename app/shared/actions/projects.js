import http from 'axios';
import { push } from 'react-router-redux'
import * as ModalActions from 'app/renderer/main/modules/Modal/Modal.actions.js';

export function getProject({projectId}) {
  return {
    type: 'PROJECTS/GET_PROJECT',
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/projects/${projectId}`
    }
  };
}

export function createProject(project) {
  return (dispatch)=>{
    dispatch({
      type: 'PROJECTS/CREATE_PROJECT',
      payload: http({
        method: 'POST',
        url: `http://localhost:3000/api/v1/projects`,
        data: project
      }).then((response)=>{
        dispatch(push(`/project/${response.data._id}/settings`))
      }).catch((response)=>{

      })
    });
  }
}


export function getUserProjects({userId}) {
  return {
    type:'PROJECTS/GET_USER_PROJECTS',
    payload: http({
      url: 'http://localhost:3000/api/v1/search',
      method: 'GET',
      params: {
        type:'project',
        parentType:'user',
        parentId: userId,
        size: 100,
        published: 'both',
      },
    }),
  }
}

export function confirmDeleteProject({projectId}) {
  return ModalActions.showConfirm({
    message: 'Deleting a project is permanent. You will not be able to undo this.',
    modalConfirm: {
      functionAlias: 'ProjectActions.deleteProject',
      functionInputs: { projectId }
    }
  })
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
      }),
      meta: {
        projectId
      }
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
    http: true,
    payload: {
      method: 'PUT',
      url: `http://localhost:3000/api/v1/remote/link/${projectId}/${provider}`,
      params: {
        path         : path,
        id           : id
      }
    },
    meta: {
      cacheKey: projectId
    }
  };
}
