const initialState = {
  fetching: false,
  fetched: false,
  user: {},
  login: {
    model: {
      email: 'founders@stemn.com',
      password: 'People123',
    },
    form: {},
  }
}

export default function (state = initialState, action) {
    const name = 'AUTH/LOAD_USER_DATA'
    switch (action.type) {
        case name+ '_PENDING':
            return {...state,
                fetching: true
            }
        case name + '_FULFILLED':
            return {...state,
                fetching: false,
                fetched: true,
                user: action.payload.data,
            }
        case name + '_REJECTED':
            return {...state,
                fetching: false,
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
        case 'AUTH/SEND_LOGIN_PENDING':
            return {...state,
              fetching: true
            }
        case 'AUTH/SEND_LOGIN_FULFILLED':
            return {...state,
              fetching: false,
            }
        case 'AUTH/SEND_LOGIN_REJECTED':
            return {...state,
              fetching: false,
            }
        case 'AUTH/LOGOUT_SUCCESS':
          return {...state,
            fetching: false,
          }
        case 'AUTH/CLEAR_USER_DATA':
          return {...state,
            user: {},
          }
        default:
            return state;
    }
}
