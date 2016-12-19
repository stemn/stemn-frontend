import { modelReducer, formReducer, modeled } from 'react-redux-form';

const initialState = {
  searchString: '',
  show: true // shows the sidebar
}


const mainReducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return {...state,
        show: action.payload || !state.show
      }
    default:
      return state;
  }
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true };
  }
  return modeled(mainReducer, 'sidebar')(state, action)
}
