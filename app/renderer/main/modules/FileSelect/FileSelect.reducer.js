import u from 'updeep';

const initialState = {

};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'FILE_SELECT/FETCH_FILES_PENDING':
      console.log(action);
      return u({
        [action.meta.key] : {
          loading: true
        }
      }, state)
    case 'FILE_SELECT/FETCH_FILES_FULFILLED':
      console.log(action);
      return u({
        [action.meta.key] : {
          data : action.payload.data.files,
          loading: false
        }
      }, state)
    default:
      return state;
  }
}
