import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'CODE_SPLITTING/LOAD_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], true)
      })
    case 'CODE_SPLITTING/LOAD_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
        setIn(draft, [action.meta.cacheKey, 'loaded'], true)
      })
    case 'CODE_SPLITTING/LOAD_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    case 'CODE_SPLITTING/LOADING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], true)
      })
    case 'CODE_SPLITTING/COMPLETE':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    default:
      return state
  }
}
