import i from 'icepick'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
//    case 'FILE_COMPARE/INIT':
//      return i.merge(state, {
//        [action.payload.compareId]: {
//          mode: 'single',
//          previewType1: action.payload.previewType1,
//          previewType2: action.payload.previewType2,
//          file1: action.payload.file1,
//          file2: action.payload.file2,
//        }
//      })
    case 'FILE_COMPARE/CHANGE_MODE':
      return i.merge(state, {
        [action.payload.compareId]: {
          mode: action.payload.mode
        }
      })
    default:
      return state
  }
}
