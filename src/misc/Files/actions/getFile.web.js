export default ({ projectId, fileId, revisionId, provider, responseType }) => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/GET_FILE',
    http: true,
    payload: {
      url: projectId
        ? `/api/v1/sync/download/${projectId}/${fileId}`
        : `/api/v1/remote/download/${provider}/${fileId}`,
      params: { revisionId },
      responseType: responseType || 'json',
    },
    meta: {
      cacheKey,
    },
  }
}
