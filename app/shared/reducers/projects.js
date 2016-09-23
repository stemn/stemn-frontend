import { modeled } from 'react-redux-form';
import i from 'icepick';

const initialState = {
  data: {},
  userProjects: {
    loading: false,
    data: []
  },
  newProject: {}
}

function reducer(state, action) {
  switch (action.type) {
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
    case 'PROJECTS/LINK_REMOTE_FULFILLED' :
      return i.assocIn(state, ['data', action.meta.cacheKey, 'data', 'remote'], action.payload.data);


    case 'PROJECTS/GET_USER_PROJECTS_PENDING':
      return i.assocIn(state, ['userProjects', 'loading'], true)
    case 'PROJECTS/GET_USER_PROJECTS_FULFILLED':
      return i.assocIn(state, ['userProjects'], {loading: false, data: action.payload.data})
    case 'PROJECTS/GET_USER_PROJECTS_REJECTED':
      return i.assocIn(state, ['userProjects', 'loading'], false)

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
  return modeled(reducer, 'projects')(state, action)
}
