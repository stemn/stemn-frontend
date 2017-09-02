import i from 'icepick'

const numBackgrounds = 8

const initialState = {
  authLoading: false,
  userLoading: false,
  emailUpdatePending: false,
  updatePasswordPending: false,
  authToken: null,

  projects: {
    loading: false,
    data: null,
  },

  user: {},
  login: {
    email: '',
    password: '',
    firstname: '',
    lastname: '',
  },
  passwordLost: {
    email: '',
  },  
  passwordSet: {
    password1: '',
    password2: '',
    oldPassword: '',
  },
  forms: {
    // Some forms for temp data
  },
  background: Math.floor(Math.random() * numBackgrounds) + 1, // We init a random number between 1 and 8 to use as the background
}


const mainReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH/INIT_HTTP_HEADER':
      return state
    case 'AUTH/LOAD_USER_DATA_PENDING':
      return { ...state,
        userLoading: true,
      }
    case 'AUTH/LOAD_USER_DATA_FULFILLED':
      return { ...state,
        userLoading: false,
        user: action.payload.data,
      }
    case 'AUTH/LOAD_USER_DATA_REJECTED':
      return { ...state,
        userLoading: false,
      }

    case 'AUTH/SET_AUTH_TOKEN':
      return { ...state,
        authToken: action.payload,
      }
    case 'AUTH/REMOVE_AUTH_TOKEN':
      return { ...state,
        authToken: null,
      }

    case 'AUTH/POST_AUTHENTICATE_PENDING':
      return { ...state,
        authLoading: true,
      }
    case 'AUTH/POST_AUTHENTICATE_FULFILLED':
      return { ...state,
        authToken: action.payload.data.token,
        authLoading: false,
      }
    case 'AUTH/POST_AUTHENTICATE_REJECTED':
      return { ...state,
        authLoading: false,
      }

    case 'AUTH/GET_TOKEN_FULFILLED':
      return { ...state,
        authToken: action.payload.data.token,
      }

    case 'AUTH/UNLINK_FULFILLED':
      return i.assocIn(state, ['user', 'accounts'], action.payload.data.accounts)

    case 'AUTH/LOGIN_PENDING':
      return { ...state,
        authLoading: true,
      }
    case 'AUTH/LOGIN_FULFILLED':
      return { ...state,
        authLoading: false,
        authToken: action.payload.data.token,
      }
    case 'AUTH/LOGIN_REJECTED':
      return { ...state,
        authLoading: false,
      }

    case 'AUTH/UPDATE_EMAIL_PENDING':
      return { ...state,
        emailUpdatePending: true,
      }
    case 'AUTH/UPDATE_EMAIL_FULFILLED':
      return { ...state,
        emailUpdatePending: false,
      }
    case 'AUTH/UPDATE_EMAIL_REJECTED':
      return { ...state,
        emailUpdatePending: false,
      }

    case 'AUTH/PASSWORD_UPDATE_PENDING':
      return { ...state,
        updatePasswordPending: true,
      }
    case 'AUTH/PASSWORD_UPDATE_FULFILLED':
      return { ...state,
        updatePasswordPending: false,
        authToken: action.payload.data.token,
        passwordSet: {
          password1: '',
          password2: '',
          oldPassword: '',
        },
      }
    case 'AUTH/PASSWORD_UPDATE_REJECTED':
      return { ...state,
        updatePasswordPending: false,
      }

    case 'AUTH/REGISTER_PENDING':
      return { ...state,
        authLoading: true,
      }
    case 'AUTH/REGISTER_FULFILLED':
      return { ...state,
        authLoading: false,
        authToken: action.payload.data.token,
      }
    case 'AUTH/REGISTER_REJECTED':
      return { ...state,
        authLoading: false,
      }
    case 'AUTH/UPDATE_USER':
      return { ...state,
        user: action.payload.user,
      }

    case 'AUTH/NEXT_BACKGROUND':
      return state.background + 1 <= numBackgrounds
        ? i.assoc(state, 'background', state.background + 1)
        : i.assoc(state, 'background', 1)

    case 'AUTH/LOGOUT':
      return Object.assign({}, state, initialState)

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
