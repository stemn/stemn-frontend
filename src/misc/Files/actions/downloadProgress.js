export default (cacheKey, progress) => {
  return {
    type: 'FILES/DOWNLOAD_PROGRESS',
    payload: {
      progress,
      cacheKey
    }
  }
}