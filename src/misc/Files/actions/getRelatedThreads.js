export default ({ projectId, fileId }) => ({
  type: 'FILES/GET_RELATED_THREADS',
  http: true,
  payload: {
    method: 'GET',
    url: `/api/v1/sync/files/${projectId}/${fileId}/threads`,
  },
  meta: {
    fileId,
  },
})