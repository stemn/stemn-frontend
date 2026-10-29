import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

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
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'percentage'], action.payload.percentage)
      })

    case 'UPLOAD/RESET':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey], {})
      })

    case 'UPLOAD/UPLOAD_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey], {
          files: action.meta.files.map((file) => ({
            preview: file.preview,
          })),
          loading: true,
        })
      })
    case 'UPLOAD/UPLOAD_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey], { loading: false })
      })
    case 'UPLOAD/UPLOAD_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    default:
      return state
  }
}
