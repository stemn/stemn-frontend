import i from 'icepick'

const initialState = {
  // someKey: {
  //   value: '',
  //   suggestions: [],
  //   isLoading: false
  // }
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'AUTO_SUGGEST/UPDATE_INPUT':
      return i.assocIn(state,  [action.meta.cacheKey, 'value'], action.payload.value)

    case 'AUTO_SUGGEST/CLEAR_SUGGESTIONS':
      return i.assocIn(state,  [action.meta.cacheKey, 'suggestions'], [])

    case 'AUTO_SUGGEST/GET_SUGGESTIONS_PENDING':
      return i.assocIn(state,  [action.meta.cacheKey, 'isLoading'], true)

    case 'AUTO_SUGGEST/GET_SUGGESTIONS_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, 'isLoading'], false)
        .assocIn([action.meta.cacheKey, 'suggestions'], action.payload.data)
        .value()

    default:
      return state
  }
}
