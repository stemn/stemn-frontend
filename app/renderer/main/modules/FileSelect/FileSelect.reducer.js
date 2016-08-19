import u from 'updeep';

const initialState = {

};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'FILE_SELECT/INIT':
      return u({
        [action.meta.storeKey] : {
          path: action.payload.path
        }
      }, state)
    case 'FILE_SELECT/SELECT':
      return u({
        [action.meta.storeKey] : {
          selected: action.payload.file,
        }
      }, state)
    case 'FILE_SELECT/DESELECT':
      return u({
        [action.meta.storeKey] : {
          selected: {}
        }
      }, state)
    case 'FILE_SELECT/CHANGE_PATH':
      return u({
        [action.meta.storeKey] : {
          path: action.payload.path
        }
      }, state)
    default:
      return state;
  }
}
