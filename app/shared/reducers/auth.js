import { modelReducer, formReducer, modeled } from 'react-redux-form';

const initialState = {
  authLoading: false,
  userLoading: false,

  user: {},
  login: {
    email: 'founders@stemn.com',
    password: 'People123',
    firstname: '',
    lastname: '',
  }
}


const mainReducer = (state, action) => {
  switch (action.type) {
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
        user: {...state.user,
          token: action.payload
        }
      }
    case 'AUTH/REMOVE_AUTH_TOKEN':
      return {...state,
        user: {...state.user,
          token: null
        }
      }

    case 'AUTH/AUTHENTICATE_PENDING':
      return {...state,
        authLoading: true
      }
    case 'AUTH/AUTHENTICATE_FULFILLED':
      return {...state,
        authLoading: false
      }
    case 'AUTH/AUTHENTICATE_REJECTED':
      return {...state,
        authLoading: false
      }

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
      return {...state,
        authLoading: false,
      }
    case 'AUTH/CLEAR_USER_DATA':
      return {...state,
        user: {},
      }
    default:
        return state;
  }
}

export default function (state = initialState, action) {
  return modeled(mainReducer, 'auth')(state, action)
}
