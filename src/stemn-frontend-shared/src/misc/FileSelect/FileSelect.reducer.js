import i from 'icepick'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'FILE_SELECT/INIT':
      return i.assocIn(state, [action.meta.storeKey, 'path'], action.payload.path)
    case 'FILE_SELECT/SELECT':
      return i.assocIn(state, [action.meta.storeKey, 'selected'], action.payload.file)
    case 'FILE_SELECT/DESELECT':
      return i.assocIn(state, [action.meta.storeKey, 'selected'], {})
    case 'FILE_SELECT/CHANGE_PATH':
      return i.assocIn(state, [action.meta.storeKey, 'path'], action.payload.path)
    default:
      return state
  }
}
