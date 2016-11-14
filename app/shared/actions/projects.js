import http from 'axios';
import { push } from 'react-router-redux'
import * as ModalActions from '../../renderer/main/modules/Modal/Modal.actions.js';

export function setActiveProject({projectId}) {
  return (dispatch, getState) => {
    const activeProject = getState().projects.activeProject;
    if(activeProject != projectId){
      dispatch({
        type: 'PROJECTS/SET_ACTIVE_PROJECT',
        payload: {
          projectId
        }
      });
      if(activeProject){
        dispatch(websocketLeaveProject({projectId: activeProject}));
      }
    }
    dispatch(websocketJoinProject({projectId}));
  }
}

export function getProject({projectId}) {
  return {
    type: 'PROJECTS/GET_PROJECT',
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/projects/${projectId}`
    }
  };
}

export function createProject(project) {
  return (dispatch)=>{
    dispatch({
      type: 'PROJECTS/CREATE_PROJECT',
      payload: http({
        method: 'POST',
        url: `/api/v1/projects`,
        data: project
      }).then((response)=>{
        dispatch(push(`/project/${response.data._id}/settings`));
        return response;
      })
    });
  }
}

export function getUserProjects({userId}) {
  return {
    type:'PROJECTS/GET_USER_PROJECTS',
    payload: http({
      url: `/api/v1/search`,
      method: 'GET',
      params: {
        type:'project',
        parentType:'user',
        parentId: userId,
        size: 1000,
        published: 'both',
        select : ['name', 'picture', 'stub', 'type', 'remote']
      },
    }),
  }
}

export function confirmDeleteProject({projectId}) {
  return ModalActions.showConfirm({
    message: 'Deleting a project is permanent. You will not be able to undo this.',
    modalConfirm: {
      type: 'ALIASED',
      aliased: true,
      payload: {
        functionAlias: 'ProjectsActions.deleteProject',
        functionInputs: { projectId }
      }
    }
  })
}

export function deleteProject({projectId}) {
  return (dispatch)=>{
    dispatch({
      type: 'PROJECTS/DELETE_PROJECT',
      payload: http({
        method: 'DELETE',
        url: `/api/v1/projects/${projectId}`,
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
      url: `/api/v1/projects/${project._id}`,
      data: project
    }),
    meta: {
      projectId: project._id
    }
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


export function linkRemote({projectId, provider, path, id, prevProvider}) {
  return (dispatch) => {
    const link = () => dispatch({
      type: 'PROJECTS/LINK_REMOTE',
      payload: http({
        method: 'PUT',
        url: `/api/v1/remote/link/${projectId}/${provider}`,
        params: {
          path         : path,
          id           : id
        }
      }),
      meta: {
        cacheKey: projectId
      }
    });
    const unlink = () => dispatch({
      type: 'PROJECTS/UNLINK_REMOTE',
      payload: http({
        method: 'DELETE',
        url: `/api/v1/remote/link/${projectId}/${prevProvider}`,
      }),
      meta: {
        cacheKey: projectId
      }
    });
    const updateProject = () => dispatch(getProject({projectId}));

    if(prevProvider){
      return unlink().then(link).then(updateProject);
    }
    else{
      return link().then(updateProject);
    }
  }
}



export function unlinkRemote({projectId, prevProvider}) {
  console.log('unlink');
  return (dispatch) => {
    dispatch({
      type: 'PROJECTS/UNLINK_REMOTE',
      payload: http({
        method: 'DELETE',
        url: `/api/v1/remote/link/${projectId}/${prevProvider}`,
      }).then(response => {
        dispatch(getProject({projectId}))
      }),
      meta: {
        cacheKey: projectId
      }
    })
  }
}

export function websocketJoinProject({projectId}) {
  return {
    type: 'PROJECTS/WEBSOCKET_JOIN_PROJECT',
    websocket: true,
    payload: {
      type : 'ROOM/JOIN',
      payload : {
        room : projectId
      }
    }
  };
}
export function websocketLeaveProject({projectId}) {
  return {
    type: 'PROJECTS/WEBSOCKET_LEAVE_PROJECT',
    websocket: true,
    payload: {
      type : 'ROOM/LEAVE',
      payload : {
        room : projectId
      }
    }
  };
}
