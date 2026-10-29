import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

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
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'value'], action.payload.value)
      })

    case 'AUTO_SUGGEST/CLEAR_SUGGESTIONS':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'suggestions'], [])
      })

    case 'AUTO_SUGGEST/GET_SUGGESTIONS_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'isLoading'], true)
      })

    case 'AUTO_SUGGEST/GET_SUGGESTIONS_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'isLoading'], false)
        setIn(draft, [action.meta.cacheKey, 'suggestions'], action.payload.data)
      })

    default:
      return state
  }
}
