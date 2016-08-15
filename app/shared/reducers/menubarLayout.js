const initialState = {
  showSidebar: false // shows the sidebar
}

export default (state = initialState, action) => {
  switch (action.type) {
      case 'MENUBAR_LAYOUT/TOGGLE_SIDEBAR':
        return {...state,
          showSidebar: action.payload || !state.showSidebar
        }
      default:
        return state;
  }
}
