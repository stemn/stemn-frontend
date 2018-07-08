import i from 'icepick'

const initialState = {

}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'HISTORY/GET_HISTORY_PENDING': {
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    }
    case 'HISTORY/GET_HISTORY_REJECTED': {
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    }
    case 'HISTORY/GET_HISTORY_FULFILLED': {
      return i.assocIn(state, [action.meta.cacheKey], {
        loading: false,
        data: action.payload.data,
      })
    }
    default:
      return state
  }
}
