import u from 'updeep';

const initialState = {

};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'FILE_LIST/FETCH_FILES_PENDING':
      return u({
        [action.meta.key] : {
          loading: true
        }
      }, state)
    case 'FILE_LIST/FETCH_FILES_FULFILLED':
      return u({
        [action.meta.key] : {
          entries : action.payload.data.entries,
          parents : action.payload.data.parents,
          loading: false
        }
      }, state)
      case 'FILE_LIST/FETCH_FILES_REJECTED':
      return u({
        [action.meta.key] : {
          loading: false
        }
      }, state)
    default:
      return state;
  }
}
