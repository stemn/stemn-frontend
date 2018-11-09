import http from 'axios';

export const getAssemblyParts = ({ projectId, fileId, revisionId = '', provider }) => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/GET_ASSEMBLY_PARTS',
    payload: http({
      url: projectId
        ? `/api/v1/sync/assemblyParts/${projectId}/${fileId}/${revisionId}`
        : `/api/v1/remote/assemblyParts/${provider}/${fileId}/${revisionId}`,
    }),
    meta: {
      cacheKey,
      fileId,
      revisionId,
    },
  }
}
