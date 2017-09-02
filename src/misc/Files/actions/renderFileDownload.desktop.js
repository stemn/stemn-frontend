export default ({ projectId, fileId, revisionId, provider, timestamp }) => {
  const cacheKey = timestamp ? `${fileId}-${revisionId}-${timestamp}` : `${fileId}-${revisionId}`
  return {
    type: 'FILES/RENDER_FILE_DOWNLOAD',
    aliased: true,
    payload: {
      functionAlias: 'FileCache.get',
      functionInputs: {
        key: cacheKey,
        url: projectId
          ? `/api/v1/sync/downloadRender/${projectId}/${fileId}`
          : `/api/v1/remote/downloadRender/${provider}/${fileId}`,
        params: { revisionId, timestamp },
        name: cacheKey,
        responseType: 'path',
        extract: true,
      },
    },
    meta: {
      cacheKey,
    },
  }
}
