import type { GetFile, IGetFileInput } from './types'

/** Downloads through the main process file cache (`FileCache.get`, an aliased action) */
export const getFile = (({ projectId, fileId, revisionId = '', provider, responseType }: IGetFileInput) => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/GET_FILE' as const,
    aliased: true as const,
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
}) satisfies GetFile
