import i from 'icepick'

const initialState = {
  like: {},
  follow: {},
  clone: {},
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SOCIAL/ADD_PENDING':
      return i.assocIn(state, [action.meta.type, action.meta.entityId], true)
    case 'SOCIAL/ADD_REJECTED':
      return i.assocIn(state, [action.meta.type, action.meta.entityId], false)

    case 'SOCIAL/REMOVE_PENDING':
      return i.assocIn(state, [action.meta.type, action.meta.entityId], false)
    case 'SOCIAL/REMOVE_REJECTED':
      return i.assocIn(state, [action.meta.type, action.meta.entityId], true)

    case 'SOCIAL/GET_STATUS_FULFILLED':
      return i.assocIn(state, [action.meta.type, action.meta.entityId], action.payload.data.status)

    default:
      return state
  }
}
