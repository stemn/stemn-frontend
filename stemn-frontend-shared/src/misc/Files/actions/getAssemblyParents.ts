import http from 'axios'
import type { IFileRevisionInput } from './types'

export const getAssemblyParents = ({ projectId, fileId, revisionId = '', provider }: IFileRevisionInput) => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/GET_ASSEMBLY_PARENTS' as const,
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
