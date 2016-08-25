import u from 'updeep';

const initialState = {

};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'UPLOAD/UPLOAD_PENDING':
      return u({
        [action.meta.cacheKey] : {
          loading: true,
          files: action.meta.files
        }
      }, state)
    case 'UPLOAD/UPLOAD_REJECTED':
      return u({
        [action.meta.cacheKey] : {
          loading: false,
        }
      }, state)
    case 'UPLOAD/UPLOAD_FULFILLED':
      return u({
        [action.meta.cacheKey] : {
          loading: false,
          data: action.payload.data
        }
      }, state)
    default:
      return state;
  }
}
