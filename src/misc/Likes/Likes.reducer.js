import i from 'icepick'

const initialState = {
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'LIKES/LIKE_PENDING':
      return i.assocIn(state, [action.meta.entityId], true)
    case 'LIKES/LIKE_REJECTED':
      return i.assocIn(state, [action.meta.entityId], false)

    case 'LIKES/UN_LIKE_PENDING':
      return i.assocIn(state, [action.meta.entityId], false)
    case 'LIKES/UN_LIKE_REJECTED':
      return i.assocIn(state, [action.meta.entityId], true)

    case 'LIKES/UPDATE_LIKED':
      return i.assocIn(state, [action.payload.entityId], action.payload.liked)

    default:
      return state
  }
}
