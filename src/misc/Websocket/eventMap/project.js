import { getProject, getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { fetchChanges } from 'stemn-shared/misc/Changes/Changes.actions.js'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'

export default (store, action) => {
  const { dispatch, getState } = store

  //  if (action.payload.actioner === getState().auth.user._id){
  //    return undefined
  //  }
  //
  //  // Actions that we DON'T process if user is the actioner
  switch (action.type) {
    case 'PROJECT/ADDED_TO_PROJECT':
      return dispatch(getUserProjects({ userId: getState().auth.user._id }))
    case 'PROJECT/PROJECT_UPDATED':
      return dispatch(getProject({ projectId: action.payload.projectId }))
    case 'PROJECT/NEW_CHANGES':
      return dispatch(fetchChanges({ projectId: action.payload.projectId }))
    case 'PROJECT/NEW_COMMITS':
      dispatch(fetchTimeline({
        entityType: 'project',
        entityId: action.payload.projectId,
      })) // TODO: add commit type to timeline?
      return dispatch(fetchChanges({ projectId: action.payload.projectId }))
  }
}
