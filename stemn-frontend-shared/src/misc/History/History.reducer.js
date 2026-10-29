import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'HISTORY/GET_HISTORY_PENDING': {
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], true)
      })
    }
    case 'HISTORY/GET_HISTORY_REJECTED': {
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    }
    case 'HISTORY/GET_HISTORY_FULFILLED': {
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey], {
          loading: false,
          data: action.payload.data,
        })
      })
    }
    default:
      return state
  }
}
