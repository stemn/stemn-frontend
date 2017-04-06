import i from 'icepick'

const initialState = {

}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'USER_FOLLOWERS/GET_FOLLOWERS_PENDING':
      return i.assocIn(state, [action.meta.userId, 'loading'], true)
    case 'USER_FOLLOWERS/GET_FOLLOWERS_REJECTED':
      return i.assocIn(state, [action.meta.userId, 'loading'], false)
    case 'USER_FOLLOWERS/GET_FOLLOWERS_FULFILLED':
      return i.assocIn(state, [action.meta.userId], {
        loading: false,
        data: action.payload.data
      })

    default:
      return state
  }
}
