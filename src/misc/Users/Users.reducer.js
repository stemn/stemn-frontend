import { modeled } from 'react-redux-form'
import i from 'icepick'

const initialState = {}

function reducer(state, action) {
  switch (action.type) {
    case 'USERS/GET_USER_PENDING':
      return i.assocIn(state, [action.meta.userId, 'loading'], true)
    case 'USERS/GET_USER_REJECTED':
      return i.assocIn(state, [action.meta.userId, 'loading'], false)
    case 'USERS/GET_USER_FULFILLED':
      return i.assocIn(state, [action.meta.userId], {
        loading: false,
        dataSize: action.meta.size,
        data: action.payload.data
      })

    case 'USERS/SAVE_USER_PENDING':
      return i.assocIn(state, [action.meta.userId, 'savePending'], true)
    case 'USERS/SAVE_USER_REJECTED':
      return i.assocIn(state, [action.meta.userId, 'savePending'], false)
    case 'USERS/SAVE_USER_FULFILLED':
      return i.assocIn(state, [action.meta.userId, 'savePending'], false)

    case 'USERS/GET_COMMIT_HISTORY_PENDING':
      return i.assocIn(state, [action.meta.userId, 'commitHistory', 'loading'], true)
    case 'USERS/GET_COMMIT_HISTORY_REJECTED':
      return i.assocIn(state, [action.meta.userId, 'commitHistory', 'loading'], false)
    case 'USERS/GET_COMMIT_HISTORY_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.userId, 'commitHistory', 'loading'], false)
        .assocIn([action.meta.userId, 'commitHistory', 'data'], action.payload.data)
        .value()

    default:
      return state
  }
}

export default function (state = initialState, action) {
  return modeled(reducer, 'users')(state, action)
}
