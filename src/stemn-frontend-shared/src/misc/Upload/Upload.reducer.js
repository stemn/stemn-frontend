import i from 'icepick'

const initialState = {
  /** ***********************************
  [cacheKey] : {
    loading: false,
    files: [{preview}, {preview}],
    percentage: 0
  }
  ************************************ */
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'UPLOAD/PROGRESS':
      return i.assocIn(state, [action.meta.cacheKey, 'percentage'], action.payload.percentage)

    case 'UPLOAD/RESET':
      return i.assocIn(state, [action.meta.cacheKey], {})

    case 'UPLOAD/UPLOAD_PENDING':
      return i.assocIn(state, [action.meta.cacheKey], {
        files: action.meta.files.map(file => ({
          preview: file.preview,
        })),
        loading: true,
      })
    case 'UPLOAD/UPLOAD_REJECTED':
      return i.assocIn(state, [action.meta.cacheKey], { loading: false })
    case 'UPLOAD/UPLOAD_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, 'loading'], false)
        .value()
    default:
      return state
  }
}
