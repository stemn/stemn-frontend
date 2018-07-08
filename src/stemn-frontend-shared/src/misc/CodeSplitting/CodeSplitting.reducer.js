import i from 'icepick'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'CODE_SPLITTING/LOAD_PENDING':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    case 'CODE_SPLITTING/LOAD_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, 'loading'], false)
        .assocIn([action.meta.cacheKey, 'loaded'], true)
        .value()
    case 'CODE_SPLITTING/LOAD_REJECTED':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    case 'CODE_SPLITTING/LOADING':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    case 'CODE_SPLITTING/COMPLETE':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    default:
      return state
  }
}
