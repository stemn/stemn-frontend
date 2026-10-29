import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'FILE_SELECT/INIT':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.storeKey, 'path'], action.payload.path)
      })
    case 'FILE_SELECT/SELECT':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.storeKey, 'selected'], action.payload.file)
      })
    case 'FILE_SELECT/DESELECT':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.storeKey, 'selected'], {})
      })
    case 'FILE_SELECT/CHANGE_PATH':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.storeKey, 'path'], action.payload.path)
      })
    default:
      return state
  }
}
