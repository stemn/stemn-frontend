export default ({ projectId, fileId, revisionId, provider, cacheKey }) => ({
  type: 'FILES/GET_META',
  http: true,
  payload: {
    method: 'GET',
    url: projectId 
      ? `/api/v1/sync/files/${projectId}/${fileId}` 
      : `/api/v1/remote/files/${provider}/${fileId}`,
    params: {
      revisionId,
    },
  },
  meta: {
    cacheKey: cacheKey || `${fileId}-${revisionId}`,
  },
})
