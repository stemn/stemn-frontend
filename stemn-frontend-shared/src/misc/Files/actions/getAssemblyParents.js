import http from 'axios'

export default ({ projectId, fileId, revisionId, provider }) => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/GET_ASSEMBLY_PARENTS',
    payload: http({
      url: projectId
        ? `/api/v1/sync/assemblyParents/${projectId}/${fileId}`
        : `/api/v1/remote/assemblyParents/${provider}/${fileId}`,
      params: { revisionId },
    }),
    meta: {
      cacheKey,
      fileId,
      revisionId,
    },
  }
}
