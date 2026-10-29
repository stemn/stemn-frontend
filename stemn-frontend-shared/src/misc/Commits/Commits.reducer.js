import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'COMMITS/GET_COMMIT_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], true)
      })
    case 'COMMITS/GET_COMMIT_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    case 'COMMITS/GET_COMMIT_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'data'], action.payload.data)
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    default:
      return state
  }
}
