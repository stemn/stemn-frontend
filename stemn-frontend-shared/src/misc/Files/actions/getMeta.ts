export const getMeta = ({ projectId, fileId, revisionId = '', provider, cacheKey }) => ({
  type: 'FILES/GET_META',
  http: true,
  payload: {
    method: 'GET',
    url: projectId
      ? `/api/v1/sync/files/${projectId}/${fileId}/${revisionId}`
      : `/api/v1/remote/files/${provider}/${fileId}/${revisionId}`,
  },
  meta: {
    cacheKey: cacheKey || `${fileId}-${revisionId}`,
  },
})
