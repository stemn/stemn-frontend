import { modeled } from 'react-redux-form';
import i from 'icepick';

const initialState = {
  data: {},
  activeProject: '',        // The currently active project
  userProjects: {
    loading: false,
    data: []
  },
  newProject: {
    summary: '',
    name: '',
    root: {
      path: '',
      fileId: '',
    },
    provider: '',
    permissions: {
      projectType: 'public'
    },
    savePending: ''
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'PROJECTS/SET_ACTIVE_PROJECT':
      return {...state,
        activeProject: action.payload.projectId
      }
    case 'PROJECTS/GET_PROJECT_FULFILLED' :
      return i.assocIn(state, ['data', action.payload.data._id, 'data'], action.payload.data)
    case 'PROJECTS/ADD_TEAM_MEMBER' :
      return i.updateIn(state, ['data', action.payload.projectId, 'data', 'team'], (team) => {
        const modifiedUser = Object.assign({}, action.payload.user, {permissions: {role: 'admin'}})
        return i.push(team, modifiedUser)
      })
    case 'PROJECTS/CHANGE_USER_PERMISSIONS' :
      return i.updateIn(state, ['data', action.payload.projectId, 'data', 'team'], (team) => {
        const index = team.findIndex((user)=>user._id == action.payload.userId);
        return [
          ...team.slice(0, index),
          i.assocIn(team[index], ['permissions', 'role'], action.payload.role),
          ...team.slice(index + 1)
        ]
      })
    case 'PROJECTS/REMOVE_TEAM_MEMBER' :
      return i.updateIn(state, ['data', action.payload.projectId, 'data', 'team'], (team) => {
        const index = team.findIndex((user)=>user._id == action.payload.userId);
        return  [
          ...team.slice(0, index),
          ...team.slice(index+ 1)
        ]
      });
      
    case 'PROJECTS/LINK_REMOTE_PENDING' :
      return i.chain(state)
      .assocIn(['data', action.meta.cacheKey, 'linkPending'], true)
      .assocIn(['data', action.meta.cacheKey, 'linkRejected'], false)
      .value();
    case 'PROJECTS/LINK_REMOTE_FULFILLED' :
      return i.chain(state)
      .assocIn(['data', action.meta.cacheKey, 'linkPending'], false)
      .assocIn(['data', action.meta.cacheKey, 'linkRejected'], false)
      .assocIn(['data', action.meta.cacheKey, 'data', 'remote'], action.payload.data)
      .value();
    case 'PROJECTS/LINK_REMOTE_REJECTED' :
      return i.chain(state)
      .assocIn(['data', action.meta.cacheKey, 'linkPending'], false)
      .assocIn(['data', action.meta.cacheKey, 'linkRejected'], true)
      .value();


    case 'PROJECTS/GET_USER_PROJECTS_PENDING':
      return i.assocIn(state, ['userProjects', 'loading'], true)
    case 'PROJECTS/GET_USER_PROJECTS_FULFILLED':
      return i.assocIn(state, ['userProjects'], {loading: false, data: action.payload.data})
    case 'PROJECTS/GET_USER_PROJECTS_REJECTED':
      return i.assocIn(state, ['userProjects', 'loading'], false)

    case 'PROJECTS/CREATE_PROJECT_PENDING':
      return i.assocIn(state, ['newProject', 'savePending'], true)
    case 'PROJECTS/CREATE_PROJECT_REJECTED':
      return i.assocIn(state, ['newProject', 'savePending'], false)
    case 'PROJECTS/CREATE_PROJECT_FULFILLED':
      return i.chain(state)
      .assoc('newProject', initialState.newProject)        // Clear the newProject object
      .updateIn(['userProjects', 'data'], (projects) => {  // Push the new project onto the userProjects array
        return i.push(projects, action.payload.data);
      })
      .value();

    case 'PROJECTS/SAVE_PROJECT_PENDING':
      return i.assocIn(state, ['data', action.meta.projectId, 'savePending'], true)
    case 'PROJECTS/SAVE_PROJECT_FULFILLED':
      return i.assocIn(state, ['data', action.meta.projectId, 'savePending'], false)
    case 'PROJECTS/SAVE_PROJECT_REJECTED':
      return i.assocIn(state, ['data', action.meta.projectId, 'savePending'], false)

    case 'PROJECTS/DELETE_PROJECT_FULFILLED' :
      return i.chain(state)
      .assocIn(['data', action.meta.projectId], undefined) // Delete the project from the main store
      .updateIn(['userProjects', 'data'], (projects) => {  // Delete it from the userProjects list
        const projectIndex = projects.findIndex( project => project._id == action.meta.projectId);
        return i.splice(projects, projectIndex, 1);
      })
      .value();
    default:
        return state;
  }
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true };
  }
  return modeled(reducer, 'projects')(state, action)
}
