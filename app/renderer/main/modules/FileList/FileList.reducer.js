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
          folder  : action.payload.data.folder,
          loading : false
        }
      }, state)
    case 'FILE_LIST/FETCH_FILES_REJECTED':
      return u({
        [action.meta.key] : {
          loading: false
        }
      }, state)

    case 'FILE_LIST/EXPLORE_FOLDER_PENDING':
      return u({
        [action.meta.key] : {
          loading: true
        }
      }, state)
    case 'FILE_LIST/EXPLORE_FOLDER_FULFILLED':
      return u({
        [action.meta.key] : {
          entries : action.payload.data.entries,
          folder  : action.payload.data.folder,
          loading : false
        }
      }, state)
    case 'FILE_LIST/EXPLORE_FOLDER_REJECTED':
      return u({
        [action.meta.key] : {
          loading: false
        }
      }, state)
    default:
      return state;
  }
}
