export const renderFileDownload = ({ projectId, fileId, revisionId = '', timestamp }) => {
  // When we are on web (and we know the render is complete)
  // we set the render path to the store instead of downloading it.
  const cacheKey = timestamp ? `${fileId}-${revisionId}-${timestamp}` : `${fileId}-${revisionId}`
  // The cache key is used as the renderId/roomId
  return {
    type: 'FILES/RENDER_FILE_DOWNLOAD_FULFILLED',
    payload: {
      data: `${GLOBAL_ENV.API_SERVER}/api/v1/sync/downloadRenderFile/${projectId}/${fileId}/${revisionId}`,
    },
    meta: {
      cacheKey,
    },
  }
}
