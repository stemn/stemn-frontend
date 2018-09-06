import i from 'icepick'
import { uniqBy } from 'lodash'

const initialState = {
  data: {
    /** *********************************
    [projectId]: {
      loading: false,
      data: {},
      fileStoreForm: {},
    }
    ********************************** */
  },
  activeProject: '',        // The currently active project
  userProjects: {
    /** *********************************
    [userId]: {
      loading: false,
      data: [],
    }
    ********************************** */
  },
  newProject: {
    summary: '',
    name: '',
    root: {
      path: '',
      fileId: '',
    },
    provider: '',
    private: false,
    savePending: '',
  },
  cloneProject: {
    name: '',
    provider: '',
    private: false,
    savePending: false,
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'PROJECTS/SET_ACTIVE_PROJECT':
      return { ...state,
        activeProject: action.payload.projectId,
      }
    
    case 'PROJECTS/GET_PROJECT_PENDING':
      return i.assocIn(state, ['data', action.meta.projectId, 'loading'], true)
    case 'PROJECTS/GET_PROJECT_REJECTED':
      return i.assocIn(state, ['data', action.meta.projectId, 'loading'], false)
    case 'PROJECTS/GET_PROJECT_FULFILLED':
      return i.chain(state)
        .assocIn(['data', action.meta.projectId, 'loading'], false)
        .assocIn(['data', action.meta.projectId, 'dataSize'], action.meta.size)
        .assocIn(['data', action.meta.projectId, 'data'], action.payload.data)
        .value()
      
    case 'PROJECTS/ADD_TEAM_MEMBER':
      return i.updateIn(state, ['data', action.payload.projectId, 'data', 'team'], (team) => {
        const modifiedUser = Object.assign({}, action.payload.user, { permissions: { role: 'admin' } })
        return i.push(team, modifiedUser)
      })
    case 'PROJECTS/REMOVE_TEAM_MEMBER':
      return i.updateIn(state, ['data', action.payload.projectId, 'data', 'team'], team => team.filter(user => user._id !== action.payload.userId))
    case 'PROJECTS/CHANGE_USER_PERMISSIONS':
      return i.updateIn(state, ['data', action.payload.projectId, 'data', 'team'], (team) => {
        const index = team.findIndex(user => user._id === action.payload.userId)
        return [
          ...team.slice(0, index),
          i.assocIn(team[index], ['permissions', 'role'], action.payload.role),
          ...team.slice(index + 1),
        ]
      })

    case 'PROJECTS/ADD_FIELD':
      return i.updateIn(state, ['data', action.payload.projectId, 'data', 'fields'], fields => uniqBy(i.push(fields, action.payload.field), '_id'))
    case 'PROJECTS/REMOVE_FIELD':
      return i.updateIn(state, ['data', action.payload.projectId, 'data', 'fields'], fields => fields.filter(field => field._id !== action.payload.fieldId))

    case 'PROJECTS/SET_LIKED':
      return i.assocIn(state, ['data', action.payload.projectId, 'data', 'liked'], true)
    case 'PROJECTS/SET_UN_LIKED':
      return i.assocIn(state, ['data', action.payload.projectId, 'data', 'liked'], false)
    case 'PROJECTS/UPDATE_LIKED':
      return i.assocIn(state, ['data', action.payload.projectId, 'data', 'liked'], action.payload.liked)

    case 'PROJECTS/LINK_REMOTE_PENDING':
      return i.chain(state)
        .assocIn(['data', action.meta.cacheKey, 'linkPending'], true)
        .assocIn(['data', action.meta.cacheKey, 'linkRejected'], false)
        .value()
    case 'PROJECTS/LINK_REMOTE_FULFILLED':
      return i.chain(state)
        .assocIn(['data', action.meta.cacheKey, 'linkPending'], false)
        .assocIn(['data', action.meta.cacheKey, 'linkRejected'], false)
        .assocIn(['data', action.meta.cacheKey, 'data', 'remote'], action.payload.data)
        .assocIn(['data', action.meta.cacheKey, 'fileStoreForm'], action.payload.data)
        .value()
    case 'PROJECTS/LINK_REMOTE_REJECTED':
      return i.chain(state)
        .assocIn(['data', action.meta.cacheKey, 'linkPending'], false)
        .assocIn(['data', action.meta.cacheKey, 'linkRejected'], true)
        .value()


    case 'PROJECTS/GET_USER_PROJECTS_PENDING':
      return i.assocIn(state, ['userProjects', action.meta.userId, 'loading'], true)
    case 'PROJECTS/GET_USER_PROJECTS_REJECTED':
      return i.assocIn(state, ['userProjects', action.meta.userId, 'loading'], false)
    case 'PROJECTS/GET_USER_PROJECTS_FULFILLED':
      return i.chain(state)
        .assocIn(['userProjects', action.meta.userId, 'data'], action.payload.data)
        .assocIn(['userProjects', action.meta.userId, 'loading'], false)
        .value()

    case 'PROJECTS/CREATE_PROJECT_PENDING':
      return i.assocIn(state, ['newProject', 'savePending'], true)
    case 'PROJECTS/CREATE_PROJECT_REJECTED':
      return i.assocIn(state, ['newProject', 'savePending'], false)
    case 'PROJECTS/CREATE_PROJECT_FULFILLED':
      return i.chain(state)
        .assoc('newProject', initialState.newProject)        // Clear the newProject object
        .updateIn(['userProjects', action.meta.userId, 'data'], projects =>   // Push the new project onto the userProjects array
          i.push(projects, action.payload.data),
        )
        .value()

    case 'PROJECTS/SAVE_PROJECT_PENDING':
      return i.assocIn(state, ['data', action.meta.projectId, 'savePending'], true)
    case 'PROJECTS/SAVE_PROJECT_FULFILLED':
      return i.assocIn(state, ['data', action.meta.projectId, 'savePending'], false)
    case 'PROJECTS/SAVE_PROJECT_REJECTED':
      return i.assocIn(state, ['data', action.meta.projectId, 'savePending'], false)

    case 'PROJECTS/CLONE_PENDING':
      return i.assocIn(state, ['cloneProject', 'savePending'], true)
    case 'PROJECTS/CLONE_FULFILLED':
      return i.assocIn(state, ['cloneProject', 'savePending'], false)
    case 'PROJECTS/CLONE_REJECTED':
      return i.assocIn(state, ['cloneProject', 'savePending'], false)

    case 'PROJECTS/DELETE_PROJECT_FULFILLED':
      return i.chain(state)
        .assocIn(['data', action.meta.projectId], undefined) // Delete the project from the main store
        .updateIn(['userProjects', action.meta.userId, 'data'], (projects) => {  // Delete it from the userProjects list
          const projectIndex = projects.findIndex(project => project._id === action.meta.projectId)
          return i.splice(projects, projectIndex, 1)
        })
        .value()
    default:
      return state
  }
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true }
  }
  return reducer(state, action)
}
