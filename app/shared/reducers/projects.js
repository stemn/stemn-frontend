var u = require('updeep');

const initialState = {

}

export default function (state = initialState, action) {
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
