import type { IHttpAction } from 'stemn-shared/redux/types'

export const getRelatedThreads = ({
  projectId,
  fileId,
}: {
  projectId: string
  fileId: string
}): IHttpAction<'FILES/GET_RELATED_THREADS', { fileId: string }> => ({
  type: 'FILES/GET_RELATED_THREADS',
  http: true,
  payload: {
    method: 'GET',
    url: `/api/v1/sync/files/${projectId}/${fileId}/threads`,
  },
  meta: {
    fileId,
  },
})
