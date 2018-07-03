import http from 'axios'
import { homeRoute } from 'route-actions'
import { push } from 'react-router-redux'
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'
import { joinRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'

const fields = {
  sm: ['name', 'picture', 'stub'],
  md: ['name', 'picture', 'stub', 'blurb', 'updated'],
  lg: ['*'],
}

export const setActiveProject = ({ projectId }) => (dispatch, getState) => {
  const activeProject = getState().projects.activeProject

  if (activeProject !== projectId) {
    dispatch({
      type: 'PROJECTS/SET_ACTIVE_PROJECT',
      payload: {
        projectId,
      },
    })

    if (activeProject) {
      dispatch(joinRoom({
        room: activeProject,
        type: 'project',
      }))
    }
  }

  dispatch(joinRoom({
    room: projectId,
    type: 'project',
  }))
}

export const getProject = ({ projectId, size = 'lg', force }) => (dispatch, getState) => {
  const project = getState().projects[projectId]

  const existingSize = project
    ? project.dataSize
    : undefined

  // if (shouldDownload(size, existingSize) || force) {
  return dispatch({
    type: 'PROJECTS/GET_PROJECT',
    httpPackage: {
      url: '/api/v1/projects',
      method: 'GET',
      staticParams: {
        select: fields[size],
      },
      params: {
        ids: projectId,
      },
    },
    meta: {
      projectId,
      size,
    },
  })
  // }
}

export const createProject = project => (dispatch, getState) => dispatch({
  type: 'PROJECTS/CREATE_PROJECT',
  payload: http({
    method: 'POST',
    url: '/api/v1/projects',
    data: project,
  }),
  meta: {
    userId: getState().auth.user._id,
  },
})

export const getUserProjects = ({ userId }) => (dispatch, getState) => dispatch({
  type: 'PROJECTS/GET_USER_PROJECTS',
  payload: http({
    url: '/api/v1/search',
    method: 'GET',
    params: {
      type: 'project',
      parentType: 'user',
      parentId: userId,
      size: 1000,
      published: 'both',
      select: ['_id', 'picture', 'stub', 'name', 'type', 'remote', 'updated', 'blurb', 'private'],
      criteria: {
        private: getState().auth.user._id === userId ? 'all' : false, // Get private project is the user is us.
      },
    },
  }),
  meta: {
    userId,
  },
})

export const confirmDeleteProject = ({ projectId, name }) => dispatch => dispatch(ModalActions.showConfirm({
  message: 'Deleting a project is permanent. You will not be able to undo this.<br/><br/> Note: All your Stemn data (such as commits and threads) will be deleted. Your files will remain in your cloud provider.',
  confirmValue: name,
  confirmPlaceholder: 'Please type in the name of this project to confirm.',
})).then(() => {
  dispatch(deleteProject({ projectId }))
})

export const deleteProject = ({ projectId }) => (dispatch, getState) => dispatch({
  type: 'PROJECTS/DELETE_PROJECT',
  payload: http({
    method: 'DELETE',
    url: `/api/v1/projects/${projectId}`,
  })
    .then(response => dispatch(push(homeRoute()))),
  meta: {
    projectId,
    userId: getState().auth.user._id,
  },
})


export const saveProject = ({ project }) => ({
  type: 'PROJECTS/SAVE_PROJECT',
  payload: http({
    method: 'PUT',
    url: `/api/v1/projects/${project._id}`,
    data: project,
  }),
  meta: {
    projectId: project._id,
  },
})

export function addTeamMember({ projectId, user }) {
  return {
    type: 'PROJECTS/ADD_TEAM_MEMBER',
    payload: {
      projectId,
      user,
    },
  }
}

export function changeUserPermissions({ projectId, userId, role }) {
  return {
    type: 'PROJECTS/CHANGE_USER_PERMISSIONS',
    payload: {
      projectId,
      userId,
      role,
    },
  }
}

export function removeTeamMember({ projectId, userId }) {
  return {
    type: 'PROJECTS/REMOVE_TEAM_MEMBER',
    payload: {
      projectId,
      userId,
    },
  }
}

export const addField = ({ projectId, field }) => ({
  type: 'PROJECTS/ADD_FIELD',
  payload: {
    projectId,
    field,
  },
})

export const removeField = ({ projectId, fieldId }) => ({
  type: 'PROJECTS/REMOVE_FIELD',
  payload: {
    projectId,
    fieldId,
  },
})


// If the store is connected - we confirm the change
// Else change straight away.
export const confirmLinkRemote = ({ isConnected, id, path, prevProvider, project, projectId, provider, userId }) => (dispatch) => {
  const linkRemoteProviderDependent = () => {
    if (!provider && prevProvider) {
      return dispatch(unlinkRemote({
        prevProvider,
        projectId,
        userId,
      }))
    } else if (provider) {
      return dispatch(linkRemote({
        id,
        path,
        prevProvider,
        projectId,
        provider,
        userId,
      }))
    }
  }

  if (isConnected) {
    return dispatch(ModalActions.showConfirm({
      message: 'Changing your file store <b>will delete your entire commit and change history.</b> Are you sure you want to do this? There is no going back.',
    })).then(() => linkRemoteProviderDependent())
  } 
  return linkRemoteProviderDependent()
}

export const linkRemote = ({ projectId, provider, path, id, prevProvider, userId }) => (dispatch) => {
  const link = () => dispatch({
    type: 'PROJECTS/LINK_REMOTE',
    payload: http({
      method: 'PUT',
      url: `/api/v1/sync/link/${projectId}/${provider}`,
      params: {
        path,
        id,
      },
    }),
    meta: {
      cacheKey: projectId,
    },
  })
  const unlink = () => dispatch({
    type: 'PROJECTS/UNLINK_REMOTE',
    payload: http({
      method: 'DELETE',
      url: `/api/v1/sync/link/${projectId}/${prevProvider}`,
    }),
    meta: {
      cacheKey: projectId,
    },
  })
  const updateProject = () => dispatch(getProject({ projectId }))
  const updateUserProjects = () => dispatch(getUserProjects({ userId }))
  const projectUpdates = () => Promise.all([updateProject(), updateUserProjects()])

  return prevProvider
    ? unlink().then(link).then(projectUpdates)
    : link().then(projectUpdates)
}

export const unlinkRemote = ({ projectId, prevProvider }) => (dispatch) => {
  dispatch({
    type: 'PROJECTS/UNLINK_REMOTE',
    payload: http({
      method: 'DELETE',
      url: `/api/v1/sync/link/${projectId}/${prevProvider}`,
    }).then((response) => {
      dispatch(getProject({ projectId }))
    }),
    meta: {
      cacheKey: projectId,
    },
  })
}

export const createClonedProject = ({ projectId, provider, isPrivate, name }) => dispatch => 
  // Clone the project
  dispatch({
    type: 'PROJECTS/CLONE',
    payload: http({
      method: 'POST',
      url: `/api/v1/sync/clone/${projectId}`,
      data: {
        name,
        provider,
        private: isPrivate,
      },
    }),
  })
