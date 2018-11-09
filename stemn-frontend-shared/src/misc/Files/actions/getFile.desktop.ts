export const getFile = ({ projectId, fileId, revisionId = '', provider, responseType }) => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/GET_FILE',
    aliased: true,
    payload: {
      functionAlias: 'FileCache.get',
      functionInputs: {
        key: cacheKey,
        url: projectId
          ? `/api/v1/sync/download/${projectId}/${fileId}/${revisionId}`
          : `/api/v1/remote/download/${provider}/${fileId}/${revisionId}`,
        name: cacheKey,
        responseType: responseType || 'json',
      },
    },
    meta: {
      cacheKey,
    },
  }
}
