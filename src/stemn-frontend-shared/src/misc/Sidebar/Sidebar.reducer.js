const initialState = {
  searchString: '',
  show: true, // shows the sidebar
  showMenubar: false, // shows the sidebar
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'SIDEBAR/TOGGLE_SIDEBAR':
      return { ...state,
        show: action.payload || !state.show,
      }
    case 'SIDEBAR/TOGGLE_MENUBAR_SIDEBAR':
      return { ...state,
        showMenubar: action.payload || !state.showMenubar,
      }
    default:
      return state
  }
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true }
  }
  return mainReducer(state, action)
}
