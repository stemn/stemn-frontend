import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'TOGGLE_PANEL/TOGGLE':
      return produce(state, (draft) => {
        setIn(draft, [action.payload.cacheKey], action.payload.value)
      })
    case 'TOGGLE_PANEL/TOGGLE_MULTI': {
      const newItems = action.payload.cacheKeys.reduce((accum, val) => {
        accum[val] = action.payload.value
        return accum
      }, {})
      return Object.assign({}, state, newItems)
    }
    default:
      return state
  }
}
