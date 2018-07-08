import http from 'axios'

export default ({ projectId, fileId, revisionId, provider }) => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/GET_ASSEMBLY_PARTS',
    payload: http({
      url: projectId
        ? `/api/v1/sync/assemblyParts/${projectId}/${fileId}`
        : `/api/v1/remote/assemblyParts/${provider}/${fileId}`,
      params: { revisionId },
    }),
    meta: {
      cacheKey,
      fileId,
      revisionId,
    },
  }
}