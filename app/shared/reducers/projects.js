import { modeled } from 'react-redux-form';
import u from 'updeep';
import i from 'icepick';

const initialState = {

}

function reducer(state, action) {
  switch (action.type) {
    case 'PROJECTS/GET_PROJECT_FULFILLED' :
      const projectData = i.merge(action.payload.data, {
        labels: [{
            _id: 'L1',
            name: 'Critical',
            color: 'rgb(255, 65, 54)',
        },{
            _id: 'L2',
            name: 'Low Priortiy',
            color: 'rgb(0, 116, 217)',
        },{
            _id: 'L3',
            name: 'Help Wanted',
            color: 'rgb(57, 204, 204)',
        },{
            _id: 'L4',
            name: 'Enhancement',
            color: 'rgb(255, 133, 27)',
        },{
            _id: 'L5',
            name: 'Bug',
            color: 'rgb(141, 198, 63)',
        }]
      })

      return i.merge(state, {
        [action.payload.data._id] : {
          data : projectData
        }
      });
    case 'PROJECTS/ADD_TEAM_MEMBER' :
      const modifiedUser = Object.assign({}, action.payload.user, {permissions: {role: 'admin'}})
      const addTeamMember = (team) => { return [].concat(team, [modifiedUser]); }
      return u({
        [action.payload.projectId] : {
          data : {
            team: addTeamMember
          }
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
          data: {
            team: changePermissions
          }
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
          data: {
            team: removeMember
          }
        }
      }, state);
    case 'PROJECTS/LINK_REMOTE_FULFILLED' :
      console.log(action.payload.data);
      return u({
        [action.meta.cacheKey] : {
          data: {
            remote: action.payload.data
          }
        }
      }, state);
    default:
        return state;
  }
}

export default function (state = initialState, action) {
  return modeled(reducer, 'projects')(state, action)
}
