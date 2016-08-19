export const GET_PROJECT = 'PROJECTS/GET_PROJECT';

export function getProject({stub}) {
  return {
    type: GET_PROJECT,
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/projects/${stub}`
    }
  };
}

export function addTeamMember({stub, user}) {
  return {
    type: 'PROJECTS/ADD_TEAM_MEMBER',
    payload: {
      stub,
      user
    }
  };
}
