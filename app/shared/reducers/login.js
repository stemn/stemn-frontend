import { modelReducer, formReducer, modeled } from 'react-redux-form';

const initialState = {
  model: {
    email: 'founders@stemn.com',
    password: 'People123',
  },
  form: {},
}

const Login = (state, action) => {
    const name = 'LOGIN/SEND_LOGIN'
    switch (action.type) {
        case name+ '_PENDING':
            return {...state,
              fetching: true
            }
        case name + '_FULFILLED':
            return {...state,
              fetching: false,
            }
        case name + '_REJECTED':
            return {...state,
              fetching: false,
            }
        case 'LOGOUT_SUCCESS':
          return {...state,
            fetching: false,
          }
        default:
            return state;
    }
}

export default function (state = initialState, action) {
  return {
    model: modeled(Login, 'login.model')(state.model, action),
    form : formReducer('login.form')(state.form, action)
  }
}
