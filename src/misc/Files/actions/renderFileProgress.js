export default ({ renderId, message }) => {
  const cacheKey = renderId
  return {
    type: 'FILES/RENDER_FILE_PROGRESS',
    payload: {
      message,
    },
    meta: {
      cacheKey,
    },
  }
}
