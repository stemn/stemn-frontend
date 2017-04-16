import { modeled } from 'react-redux-form'
import i from 'icepick'

const initialState = {}

const reducer = (state, action) => {
  switch (action.type) {
    case 'FIELDS/GET_FIELD_PENDING':
      return i.assocIn(state, [action.meta.fieldId, 'loading'], true)
    case 'FIELDS/GET_FIELD_REJECTED':
      return i.assocIn(state, [action.meta.fieldId, 'loading'], false)
    case 'FIELDS/GET_FIELD_FULFILLED':
      return i.assocIn(state, [action.meta.fieldId], {
        loading: false,
        dataSize: action.meta.size,
        data: action.payload.data
      })

    case 'FIELDS/SAVE_FIELD_PENDING':
      return i.assocIn(state, [action.meta.fieldId, 'savePending'], true)
    case 'FIELDS/SAVE_FIELD_REJECTED':
      return i.assocIn(state, [action.meta.fieldId, 'savePending'], false)
    case 'FIELDS/SAVE_FIELD_FULFILLED':
      return i.assocIn(state, [action.meta.fieldId, 'savePending'], false)

    default:
      return state
  }
}

export default (state = initialState, action) => modeled(reducer, 'fields')(state, action)
