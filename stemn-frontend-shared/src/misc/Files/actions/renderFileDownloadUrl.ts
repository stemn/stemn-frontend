/**
 * Puts the address of a finished render in the store instead of downloading it: the website's viewers fetch what
 * they need themselves (the Autodesk viewer the SVF parts, the open-source viewer the glb), and so does the
 * desktop app for open-source renders. `cadProvider` says which viewer the render is for.
 */
export const renderFileDownloadUrl = ({ projectId, fileId, revisionId = '', timestamp, cadProvider }) => {
  // The cache key is used as the renderId/roomId
  const cacheKey = timestamp ? `${fileId}-${revisionId}-${timestamp}` : `${fileId}-${revisionId}`
  return {
    type: 'FILES/RENDER_FILE_DOWNLOAD_FULFILLED',
    payload: {
      data: `${GLOBAL_ENV.API_SERVER}/api/v1/sync/downloadRenderFile/${projectId}/${fileId}/${revisionId}`,
      cadProvider,
    },
    meta: {
      cacheKey,
    },
  }
}
