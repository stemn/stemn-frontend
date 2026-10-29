import { produce } from 'immer'
import { get, toPath } from 'lodash'
import { setIn } from 'stemn-shared/redux/draft'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'STORE/CHANGE':
      return action.payload.model.length > 0 // This will be 0 if we are clearing the store
        ? produce(state, (draft) => {
            setIn(draft, toPath(action.payload.model), action.payload.value)
          })
        : action.payload.value
    case 'STORE/LOAD':
      return produce(state, (draft) => {
        setIn(draft, toPath(action.payload.model), action.payload.value)
      })
    case 'STORE/PUSH': {
      const path = toPath(action.payload.model)
      return produce(state, (draft) => {
        setIn(draft, path, [...(get(state, path) || []), action.payload.item])
      })
    }
    case 'STORE/REMOVE':
      return produce(state, (draft) => {
        get(draft, toPath(action.payload.model)).splice(action.payload.index, 1)
      })
    default:
      return state
  }
}
