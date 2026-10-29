import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {
  data: {}, // fields by id
  newFieldForm: {
    // form data for a new field
    name: '',
    blurb: '',
  },
  newFieldFormPending: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'FIELDS/GET_FIELD_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.fieldId, 'loading'], true)
      })
    case 'FIELDS/GET_FIELD_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.fieldId, 'loading'], false)
      })
    case 'FIELDS/GET_FIELD_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.fieldId], {
          loading: false,
          dataSize: action.meta.size,
          data: action.payload.data,
        })
      })

    case 'FIELDS/CREATE_FIELD_PENDING':
      return produce(state, (draft) => {
        draft.newFieldFormPending = true
      })
    case 'FIELDS/CREATE_FIELD_REJECTED':
      return produce(state, (draft) => {
        draft.newFieldFormPending = false
      })
    case 'FIELDS/CREATE_FIELD_FULFILLED':
      return produce(state, (draft) => {
        draft.newFieldFormPending = false
        draft.newFieldForm = { name: '', blurb: '' }
      })

    case 'FIELDS/SAVE_FIELD_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.fieldId, 'savePending'], true)
      })
    case 'FIELDS/SAVE_FIELD_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.fieldId, 'savePending'], false)
      })
    case 'FIELDS/SAVE_FIELD_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.fieldId, 'savePending'], false)
      })

    default:
      return state
  }
}
