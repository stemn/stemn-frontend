import http from 'axios';

export const getAssemblyParents = (
  { projectId, fileId, revisionId = '', provider }:
  { projectId: string, fileId: string, revisionId: string, provider: string },
) => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/GET_ASSEMBLY_PARENTS',
    payload: http({
      url: projectId
        ? `/api/v1/sync/assemblyParents/${projectId}/${fileId}/${revisionId}`
        : `/api/v1/remote/assemblyParents/${provider}/${fileId}/${revisionId}`,
    }),
    meta: {
      cacheKey,
      fileId,
      revisionId,
    },
  }
}
