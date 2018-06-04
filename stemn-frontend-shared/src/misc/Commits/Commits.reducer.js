import i from 'icepick'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'COMMITS/GET_COMMIT_PENDING':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    case 'COMMITS/GET_COMMIT_REJECTED':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    case 'COMMITS/GET_COMMIT_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, 'data'], action.payload.data)
        .assocIn([action.meta.cacheKey, 'loading'], false)
        .value()
    default:
      return state
  }
}
