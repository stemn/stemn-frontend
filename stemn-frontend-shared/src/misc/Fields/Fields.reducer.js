import i from 'icepick'

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
      return i.assocIn(state, ['data', action.meta.fieldId, 'loading'], true)
    case 'FIELDS/GET_FIELD_REJECTED':
      return i.assocIn(state, ['data', action.meta.fieldId, 'loading'], false)
    case 'FIELDS/GET_FIELD_FULFILLED':
      return i.assocIn(state, ['data', action.meta.fieldId], {
        loading: false,
        dataSize: action.meta.size,
        data: action.payload.data,
      })

    case 'FIELDS/CREATE_FIELD_PENDING':
      return i.assoc(state, 'newFieldFormPending', true)
    case 'FIELDS/CREATE_FIELD_REJECTED':
      return i.assoc(state, 'newFieldFormPending', false)
    case 'FIELDS/CREATE_FIELD_FULFILLED':
      return i.chain(state)
        .assoc('newFieldFormPending', false)
        .assoc('newFieldForm', {
          name: '',
          blurb: '',
        })
        .value()

    case 'FIELDS/SAVE_FIELD_PENDING':
      return i.assocIn(state, ['data', action.meta.fieldId, 'savePending'], true)
    case 'FIELDS/SAVE_FIELD_REJECTED':
      return i.assocIn(state, ['data', action.meta.fieldId, 'savePending'], false)
    case 'FIELDS/SAVE_FIELD_FULFILLED':
      return i.assocIn(state, ['data', action.meta.fieldId, 'savePending'], false)

    default:
      return state
  }
}
