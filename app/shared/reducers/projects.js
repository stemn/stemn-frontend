import { modeled } from 'react-redux-form';
import u from 'updeep';

const initialState = {

}

function reducer(state, action) {
  switch (action.type) {
    case 'PROJECTS/GET_PROJECT_FULFILLED' :
      return {...state,
        [action.payload.data._id] : action.payload.data
      }
    case 'PROJECTS/ADD_TEAM_MEMBER' :
      const modifiedUser = Object.assign({}, action.payload.user, {permissions: {role: 'admin'}})
      const addTeamMember = (team) => { return [].concat(team, [modifiedUser]); }
      return u({
        [action.payload.projectId] : {
          team: addTeamMember
        }
      }, state);
    case 'PROJECTS/CHANGE_USER_PERMISSIONS' :
      const changePermissions = (team) => {
        const index = team.findIndex((user)=>user._id == action.payload.userId);
        return  [
          ...team.slice(0, index),
          u({permissions: {role: action.payload.role}}, team[index]),
          ...team.slice(index + 1)
        ]
      }
      return u({
        [action.payload.projectId] : {
          team: changePermissions
        }
      }, state);
    case 'PROJECTS/REMOVE_TEAM_MEMBER' :
      const removeMember = (team) => {
        const index = team.findIndex((user)=>user._id == action.payload.userId);
        return  [
          ...team.slice(0, index),
          ...team.slice(index+ 1)
        ]
      }
      return u({
        [action.payload.projectId] : {
          team: removeMember
        }
      }, state);
    case 'PROJECTS/LINK_REMOTE_FULFILLED' :
      return u({
        [action.cacheKey] : {
          remote: action.payload.data
        }
      }, state);
    default:
        return state;
  }
}

export default function (state = initialState, action) {
  return modeled(reducer, 'projects')(state, action)
}
