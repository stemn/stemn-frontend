export default (cacheKey, progress) => ({
  type: 'FILES/DOWNLOAD_PROGRESS',
  payload: {
    progress,
    cacheKey,
  },
})