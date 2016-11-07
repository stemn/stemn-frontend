import i from 'icepick';

const initialState = { };

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case 'UPLOAD/INIT':
      return i.assocIn(state, [action.payload.cacheKey, 'files'], action.payload.files)

    case 'UPLOAD/UPLOAD_PENDING':
      return i.assocIn(state, [action.meta.cacheKey], {
        files: action.meta.files,
        loading: true
      })
    case 'UPLOAD/UPLOAD_REJECTED':
      return i.assocIn(state, [action.meta.cacheKey], { loading: false })
    case 'UPLOAD/UPLOAD_FULFILLED':
      return i.chain(state)
      .assocIn([action.meta.cacheKey, 'loading'], false)
      .assocIn([action.meta.cacheKey, 'files', '0', 'response'], action.payload.data)
      .value()
    default:
      return state;
  }
}