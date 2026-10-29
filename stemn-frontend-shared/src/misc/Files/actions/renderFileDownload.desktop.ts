import type { IRenderFileInput, RenderFileDownload } from './types'

/** Downloads (and extracts) the render through the main process file cache (`FileCache.get`) */
export const renderFileDownload = (({ projectId, fileId, revisionId = '', provider, timestamp }: IRenderFileInput) => {
  const cacheKey = timestamp ? `${fileId}-${revisionId}-${timestamp}` : `${fileId}-${revisionId}`
  return {
    type: 'FILES/RENDER_FILE_DOWNLOAD' as const,
    aliased: true as const,
    payload: {
      functionAlias: 'FileCache.get',
      functionInputs: {
        key: cacheKey,
        url: projectId
          ? `/api/v1/sync/downloadRender/${projectId}/${fileId}/${revisionId}`
          : `/api/v1/remote/downloadRender/${provider}/${fileId}/${revisionId}`,
        params: { timestamp },
        name: cacheKey,
        responseType: 'path',
        extract: true,
      },
    },
    meta: {
      cacheKey,
    },
  }
}) satisfies RenderFileDownload
