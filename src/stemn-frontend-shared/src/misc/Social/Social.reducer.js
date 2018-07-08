import i from 'icepick'

const initialState = {
  like: {},
  follow: {},
  clone: {},
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'SOCIAL/ADD_PENDING':
      return i.assocIn(state, [action.meta.type, action.meta.entityId, 'status'], true)
    case 'SOCIAL/ADD_REJECTED':
      return i.assocIn(state, [action.meta.type, action.meta.entityId, 'status'], false)

    case 'SOCIAL/REMOVE_PENDING':
      return i.assocIn(state, [action.meta.type, action.meta.entityId, 'status'], false)
    case 'SOCIAL/REMOVE_REJECTED':
      return i.assocIn(state, [action.meta.type, action.meta.entityId, 'status'], true)

    case 'SOCIAL/GET_STATUS_FULFILLED':
      return i.assocIn(state, [action.meta.type, action.meta.entityId], {
        status: action.payload.data.status,
        parentId: action.payload.data.parentId,
      })

    default:
      return state
  }
}
