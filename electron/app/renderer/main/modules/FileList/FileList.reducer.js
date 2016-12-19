import i from 'icepick';
const initialState = {

};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'FILE_LIST/FETCH_FILES_PENDING':
      return i.assocIn(state, [action.meta.key, 'loading'], true)
    case 'FILE_LIST/FETCH_FILES_REJECTED':
      return i.assocIn(state, [action.meta.key, 'loading'], false)
    case 'FILE_LIST/FETCH_FILES_FULFILLED':
      return i.assoc(state, action.meta.key, {
        entries : action.payload.data.entries,
        folder  : action.payload.data.folder,
        loading : false
      })

    case 'FILE_LIST/EXPLORE_FOLDER_PENDING':
      return i.assocIn(state, [action.meta.key, 'loading'], true)
    case 'FILE_LIST/EXPLORE_FOLDER_REJECTED':
      return i.assocIn(state, [action.meta.key, 'loading'], false)
    case 'FILE_LIST/EXPLORE_FOLDER_FULFILLED':
      return i.assoc(state, action.meta.key, {
        entries : action.payload.data.entries,
        folder  : action.payload.data.folder,
        loading : false
      })
    default:
      return state;
  }
}
