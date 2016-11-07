import { modeled } from 'react-redux-form';
import i from 'icepick';

const initialState = {

}

function reducer(state, action) {
  switch (action.type) {
    case 'USERS/GET_USER_PENDING' :
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    case 'USERS/GET_USER_REJECTED' :
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    case 'USERS/GET_USER_FULFILLED' :
      return i.assocIn(state, [action.meta.cacheKey], {
        loading: false,
        data: action.payload.data
      })

    case 'USERS/SAVE_USER_PENDING':
      return i.assocIn(state, [action.meta.userId, 'savePending'], true)
    case 'USERS/SAVE_USER_REJECTED':
      return i.assocIn(state, [action.meta.userId, 'savePending'], false)
    case 'USERS/SAVE_USER_FULFILLED':
      return i.assocIn(state, [action.meta.userId, 'savePending'], false)

    default:
        return state;
  }
}

export default function (state = initialState, action) {
  return modeled(reducer, 'users')(state, action)
}
