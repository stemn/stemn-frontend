import i from 'icepick'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'USERS/GET_USER_PENDING':
      return i.assocIn(state, [action.meta.userId, 'loading'], true)
    case 'USERS/GET_USER_REJECTED':
      return i.assocIn(state, [action.meta.userId, 'loading'], false)
    case 'USERS/GET_USER_FULFILLED':
      return i.assocIn(state, [action.meta.userId], {
        loading: false,
        dataSize: action.meta.size,
        data: action.payload.data,
      })

    case 'USERS/SAVE_USER_PENDING':
      return i.assocIn(state, [action.meta.userId, 'savePending'], true)
    case 'USERS/SAVE_USER_REJECTED':
      return i.assocIn(state, [action.meta.userId, 'savePending'], false)
    case 'USERS/SAVE_USER_FULFILLED':
      return i.assocIn(state, [action.meta.userId, 'savePending'], false)

    default:
      return state
  }
}
