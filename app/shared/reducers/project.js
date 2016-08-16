const initialState = {
  activeProject: ''
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'PROJECT/SET_ACTIVE_PROJECT':
      return {...state,
        activeProject: action.payload
      }
    default:
      return state;
  }
}
