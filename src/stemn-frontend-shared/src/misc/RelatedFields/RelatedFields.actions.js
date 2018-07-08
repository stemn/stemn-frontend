export const getRelatedFields = ({ page = 1, size = 10, fieldId }) => ({
  type: 'RELATED_FIELDS/GET_RELATED_FIELDS',
  http: true,
  payload: {
    url: `/api/v1/fields/${fieldId}/related`,
    method: 'GET',
    params: {
      page,
      size,
      type: 'field',
    },
  },
  meta: {
    fieldId,
  },
})
