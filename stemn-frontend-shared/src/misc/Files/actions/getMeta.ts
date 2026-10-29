import type { IHttpAction } from 'stemn-shared/redux/types'
import type { IFileRevisionInput } from './types'

export const getMeta = ({
  projectId,
  fileId,
  revisionId = '',
  provider,
  cacheKey,
}: IFileRevisionInput & { cacheKey?: string }): IHttpAction<'FILES/GET_META', { cacheKey: string }> => ({
  type: 'FILES/GET_META',
  http: true,
  payload: {
    method: 'GET',
    url: projectId
      ? `/api/v1/sync/files/${projectId}/${fileId}/${revisionId}`
      : `/api/v1/remote/files/${provider}/${fileId}/${revisionId}`,
  },
  meta: {
    cacheKey: cacheKey || `${fileId}-${revisionId}`,
  },
})
