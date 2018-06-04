export default ({ fileId, revisionId, error }) => {
  const cacheKey = `${fileId}-${revisionId}`
  return {
    type: 'FILES/RENDER_FILE_REJECTED',
    payload: {
      response: {
        data: {
          error,
        },
      },
    },
    meta: {
      cacheKey,
    },
  }
}
