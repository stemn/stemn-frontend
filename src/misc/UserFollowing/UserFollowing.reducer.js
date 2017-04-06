import i from 'icepick'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'USER_FOLLOWING/GET_FOLLOWING_PENDING':
      return i.assocIn(state, [action.meta.userId, 'loading'], true)
    case 'USER_FOLLOWING/GET_FOLLOWING_REJECTED':
      return i.assocIn(state, [action.meta.userId, 'loading'], false)
    case 'USER_FOLLOWING/GET_FOLLOWING_FULFILLED':
      return i.assocIn(state, [action.meta.userId], {
        loading: false,
        data: action.payload.data
      })

    default:
      return state
  }
}
