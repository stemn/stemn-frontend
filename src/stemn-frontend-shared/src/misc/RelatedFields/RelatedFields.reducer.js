import i from 'icepick'

const initialState = {}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'RELATED_FIELDS/GET_RELATED_FIELDS_PENDING': {
      return i.assocIn(state, [action.meta.fieldId, 'loading'], true)
    }
    case 'RELATED_FIELDS/GET_RELATED_FIELDS_REJECTED': {
      return i.assocIn(state, [action.meta.fieldId, 'loading'], true)
    }
    case 'RELATED_FIELDS/GET_RELATED_FIELDS_FULFILLED': {
      return i.chain(state)
        .assocIn([action.meta.fieldId, 'loading'], false)
        .assocIn([action.meta.fieldId, 'data'], action.payload.data)
        .value()
    }

    default:
      return state
  }
}
