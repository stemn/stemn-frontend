import i from 'icepick';

const initialState = {
  active : ['project.changes']
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'WALKTHROUGH/ACTIVATE': {
      return state
    }
    case 'WALKTHROUGH/DEACTIVATE': {
      return state
    }
    default:
      return state;
  }
}
