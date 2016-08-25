import { modeled } from 'react-redux-form';
import u from 'updeep';

const initialState = {

}

function reducer(state, action) {
  switch (action.type) {
    case 'USERS/GET_USER_FULFILLED' :
      return {...state,
        [action.meta.cacheKey] : action.payload.data
      }
    default:
        return state;
  }
}

export default function (state = initialState, action) {
  return modeled(reducer, 'users')(state, action)
}
