import i from 'icepick'

const initialState = {
  /*
    [cacheKey] : {
      mode,
      selected1,
      selected2,
      lastSelected,
    }
  */

}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'FILE_COMPARE/INIT':
      return i.assoc(state, action.meta.cacheKey, {
        mode: action.payload.mode,
        selected1: action.payload.selected1,
        selected2: action.payload.selected2,
        lastSelected: 1,
      })
    case 'FILE_COMPARE/SELECT':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, `selected${action.payload.selectedKey}`], action.payload.file)
        .assocIn([action.meta.cacheKey, 'lastSelected'], action.payload.selectedKey)
        .value()

    case 'FILE_COMPARE/CHANGE_MODE':
      return i.merge(state, {
        [action.meta.cacheKey]: {
          mode: action.payload.mode,
        },
      })
    default:
      return state
  }
}
