import { modeled } from 'react-redux-form';
import u from 'updeep';

const initialState = {

}

function reducer(state, action) {
  switch (action.type) {
    case 'PROJECTS/GET_PROJECT_FULFILLED' :
      return {...state,
        [action.payload.data.stub] : action.payload.data
      }
    case 'PROJECTS/ADD_TEAM_MEMBER' :
      const addTeamMember = (team) => { return [].concat(team, [action.payload.user]); }
      return u({
        [action.payload.stub] : {
          team: addTeamMember
        }
      }, state);
    default:
        return state;
  }
}

export default function (state = initialState, action) {
  return modeled(reducer, 'projects')(state, action)
}
