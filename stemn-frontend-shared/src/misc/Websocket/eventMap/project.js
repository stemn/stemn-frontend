import { getProject, getUserProjects } from 'stemn-shared/misc/Projects/Projects.actions.js'
import { fetchChanges } from 'stemn-shared/misc/Changes/Changes.actions.js'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions'
import { queryKeys } from 'stemn-shared/api/query/keys'
import { refresh } from './refresh'

export default (store, action) => {
  const { dispatch, getState } = store

  //  if (action.payload.actioner === getState().auth.user._id){
  //    return undefined
  //  }
  //
  //  // Actions that we DON'T process if user is the actioner
  switch (action.type) {
    case 'PROJECT/ADDED_TO_PROJECT': {
      const userId = getState().auth.user._id
      return refresh(store, [queryKeys.projects.byUser(userId)], () => dispatch(getUserProjects({ userId })))
    }
    case 'PROJECT/PROJECT_UPDATED': {
      const { projectId } = action.payload
      // When the project page observes the query, its refetch also updates projects.data (legacy bridge)
      return refresh(store, [queryKeys.projects.detail(projectId)], () => dispatch(getProject({ projectId })))
    }
    case 'PROJECT/NEW_CHANGES':
      return dispatch(fetchChanges({ projectId: action.payload.projectId }))
    case 'PROJECT/NEW_COMMITS':
      dispatch(
        fetchTimeline({
          entityType: 'project',
          entityId: action.payload.projectId,
        }),
      ) // TODO: add commit type to timeline?
      return dispatch(fetchChanges({ projectId: action.payload.projectId }))
  }
}
