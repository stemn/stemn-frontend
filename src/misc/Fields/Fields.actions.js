export const getField = ({ fieldId }) => ({
  type: 'FIELDS/GET_FIELD',
  http: true,
  payload: {
    url: `/api/v1/fields/${fieldId}`,
    method: 'GET',
  },
  meta: {
    fieldId,
  },
})

export const createField = ({ field }) => ({
  // The newFieldForm is cleared when this is fullfilled
  type: 'FIELDS/CREATE_FIELD',
  http: true,
  payload: {
    url: '/api/v1/fields',
    method: 'POST',
    data: {
      name: field.name,
      blurb: field.blurb,
    },
  },
})

export const saveField = ({ field }) => ({
  type: 'FIELDS/SAVE_FIELD',
  http: true,
  payload: {
    method: 'PUT',
    url: `/api/v1/fields/${field._id}`,
    data: field,
  },
  meta: {
    fieldId: field._id,
  },
})
