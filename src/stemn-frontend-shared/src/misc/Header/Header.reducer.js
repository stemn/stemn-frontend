const initialState = {
  navMenu: [
    {
      name: 'Changes',
      path: '/',
    }, {
      name: 'History',
      path: '/feed',
    },
  ],
  userPopup: {
    isOpen: false,
  },
}

export default function job(state = initialState, action) {
  switch (action.type) {
    case 'HEADER/TOGGLE_USER_MENU' :
      return { ...state,
        userPopup: { ...state.userPopup,
          isOpen: action.payload || !state.userPopup.isOpen,
        },
      }
    default:
      return state
  }
}
