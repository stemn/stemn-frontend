import { produce } from 'immer'
import { get, uniqBy } from 'lodash'
import { setIn } from 'stemn-shared/redux/draft'

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
  activeProject: '', // The currently active project
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
      return { ...state, activeProject: action.payload.projectId }

    case 'PROJECTS/GET_PROJECT_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.projectId, 'loading'], true)
      })
    case 'PROJECTS/GET_PROJECT_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.projectId, 'loading'], false)
      })
    case 'PROJECTS/GET_PROJECT_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.projectId, 'loading'], false)
        setIn(draft, ['data', action.meta.projectId, 'dataSize'], action.meta.size)
        setIn(draft, ['data', action.meta.projectId, 'data'], action.payload.data)
      })

    case 'PROJECTS/ADD_TEAM_MEMBER':
      return produce(state, (draft) => {
        const modifiedUser = Object.assign({}, action.payload.user, { permissions: { role: 'admin' } })
        get(draft, ['data', action.payload.projectId, 'data', 'team']).push(modifiedUser)
      })
    case 'PROJECTS/REMOVE_TEAM_MEMBER': {
      const path = ['data', action.payload.projectId, 'data', 'team']
      return produce(state, (draft) => {
        setIn(
          draft,
          path,
          get(state, path).filter((user) => user._id !== action.payload.userId),
        )
      })
    }
    case 'PROJECTS/CHANGE_USER_PERMISSIONS':
      return produce(state, (draft) => {
        const team = get(draft, ['data', action.payload.projectId, 'data', 'team'])
        const index = team.findIndex((user) => user._id === action.payload.userId)
        setIn(team[index], ['permissions', 'role'], action.payload.role)
      })

    case 'PROJECTS/ADD_FIELD': {
      const path = ['data', action.payload.projectId, 'data', 'fields']
      return produce(state, (draft) => {
        setIn(draft, path, uniqBy([...get(state, path), action.payload.field], '_id'))
      })
    }
    case 'PROJECTS/REMOVE_FIELD': {
      const path = ['data', action.payload.projectId, 'data', 'fields']
      return produce(state, (draft) => {
        setIn(
          draft,
          path,
          get(state, path).filter((field) => field._id !== action.payload.fieldId),
        )
      })
    }

    case 'PROJECTS/SET_LIKED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.payload.projectId, 'data', 'liked'], true)
      })
    case 'PROJECTS/SET_UN_LIKED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.payload.projectId, 'data', 'liked'], false)
      })
    case 'PROJECTS/UPDATE_LIKED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.payload.projectId, 'data', 'liked'], action.payload.liked)
      })

    case 'PROJECTS/LINK_REMOTE_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.cacheKey, 'linkPending'], true)
        setIn(draft, ['data', action.meta.cacheKey, 'linkRejected'], false)
      })
    case 'PROJECTS/LINK_REMOTE_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.cacheKey, 'linkPending'], false)
        setIn(draft, ['data', action.meta.cacheKey, 'linkRejected'], false)
        setIn(draft, ['data', action.meta.cacheKey, 'data', 'remote'], action.payload.data)
        setIn(draft, ['data', action.meta.cacheKey, 'fileStoreForm'], action.payload.data)
      })
    case 'PROJECTS/LINK_REMOTE_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.cacheKey, 'linkPending'], false)
        setIn(draft, ['data', action.meta.cacheKey, 'linkRejected'], true)
      })

    case 'PROJECTS/GET_USER_PROJECTS_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['userProjects', action.meta.userId, 'loading'], true)
      })
    case 'PROJECTS/GET_USER_PROJECTS_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['userProjects', action.meta.userId, 'loading'], false)
      })
    case 'PROJECTS/GET_USER_PROJECTS_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['userProjects', action.meta.userId, 'data'], action.payload.data)
        setIn(draft, ['userProjects', action.meta.userId, 'loading'], false)
      })

    case 'PROJECTS/CREATE_PROJECT_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['newProject', 'savePending'], true)
      })
    case 'PROJECTS/CREATE_PROJECT_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['newProject', 'savePending'], false)
      })
    case 'PROJECTS/CREATE_PROJECT_FULFILLED':
      return produce(state, (draft) => {
        draft.newProject = initialState.newProject // Clear the newProject object
        // Push the new project onto the userProjects array
        get(draft, ['userProjects', action.meta.userId, 'data']).push(action.payload.data)
      })

    case 'PROJECTS/SAVE_PROJECT_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.projectId, 'savePending'], true)
      })
    case 'PROJECTS/SAVE_PROJECT_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.projectId, 'savePending'], false)
      })
    case 'PROJECTS/SAVE_PROJECT_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.projectId, 'savePending'], false)
      })

    case 'PROJECTS/CLONE_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['cloneProject', 'savePending'], true)
      })
    case 'PROJECTS/CLONE_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['cloneProject', 'savePending'], false)
      })
    case 'PROJECTS/CLONE_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['cloneProject', 'savePending'], false)
      })

    case 'PROJECTS/DELETE_PROJECT_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.projectId], undefined) // Delete the project from the main store
        // Delete it from the userProjects list
        const projects = get(draft, ['userProjects', action.meta.userId, 'data'])
        const projectIndex = projects.findIndex((project) => project._id === action.meta.projectId)
        projects.splice(projectIndex, 1)
      })
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
