import { modelReducer, formReducer, modeled } from 'react-redux-form';
import http from 'axios';
import i from 'icepick';


const initialState = {
  authLoading: false,
  userLoading: false,
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
  }
}


const mainReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH/REMOVE_HTTP_HEADER':
      delete http.defaults.headers.common['Authorization']; // In reducer so it happens on all threads
      return state    
    case 'AUTH/INIT_HTTP_HEADER':
      http.defaults.headers.common['Authorization'] = action.payload.fullToken; // In reducer so it happens on all threads
      return state
    case 'AUTH/LOAD_USER_DATA_PENDING':
      return {...state,
        userLoading: true
      }
    case 'AUTH/LOAD_USER_DATA_FULFILLED':
      return {...state,
        userLoading: false,
        user: action.payload.data,
      }
    case 'AUTH/LOAD_USER_DATA_REJECTED':
      return {...state,
        userLoading: false,
      }

    case 'AUTH/SET_AUTH_TOKEN':
      return {...state,
        authToken: action.payload
      }
    case 'AUTH/REMOVE_AUTH_TOKEN':
      return {...state,
        authToken: null
      }

    case 'AUTH/POST_AUTHENTICATE_PENDING':
      return {...state,
        authLoading: true
      }
    case 'AUTH/POST_AUTHENTICATE_FULFILLED':
      return {...state,
        authLoading: false
      }
    case 'AUTH/POST_AUTHENTICATE_REJECTED':
      return {...state,
        authLoading: false
      }    

    case 'AUTH/UNLINK_FULFILLED':
      return i.assocIn(state, ['user', 'accounts'], action.payload.data.accounts)

    case 'AUTH/LOGIN_PENDING':
      return {...state,
        authLoading: true
      }
    case 'AUTH/LOGIN_FULFILLED':
      return {...state,
        authLoading: false,
      }
    case 'AUTH/LOGIN_REJECTED':
      return {...state,
        authLoading: false,
      }

    case 'AUTH/REGISTER_PENDING':
      return {...state,
        authLoading: true
      }
    case 'AUTH/REGISTER_FULFILLED':
      return {...state,
        authLoading: false,
      }
    case 'AUTH/REGISTER_REJECTED':
      return {...state,
        authLoading: false,
      }

    case 'AUTH/LOGOUT':
      return i.assoc(state, initialState);
    case 'AUTH/CLEAR_USER_DATA':
      return {...state,
        user: {},
      }
    default:
        return state;
  }
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true };
  }
  return modeled(mainReducer, 'auth')(state, action)
}
