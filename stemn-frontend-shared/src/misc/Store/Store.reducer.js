import i from 'icepick'
import { toPath } from 'lodash'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case 'STORE/CHANGE':
      return action.payload.model.length > 0 // This will be 0 if we are clearing the store
        ? i.assocIn(state, toPath(action.payload.model), action.payload.value)
        : action.payload.value
    case 'STORE/LOAD':
      return i.assocIn(state, toPath(action.payload.model), action.payload.value)
    case 'STORE/PUSH':
      return i.updateIn(state, toPath(action.payload.model), (item) => i.push(item || [], action.payload.item))
    case 'STORE/REMOVE':
      return i.updateIn(state, toPath(action.payload.model), (item) => i.splice(item, action.payload.index, 1))
    default:
      return state
  }
}
