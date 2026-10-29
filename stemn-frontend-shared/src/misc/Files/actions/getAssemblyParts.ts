import http from 'axios'
import type { IFileRevisionInput } from './types'

export const getAssemblyParts = ({ projectId, fileId, revisionId = '', provider }: IFileRevisionInput) => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/GET_ASSEMBLY_PARTS' as const,
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
