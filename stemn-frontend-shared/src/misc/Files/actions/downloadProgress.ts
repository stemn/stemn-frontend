export const downloadProgress = (cacheKey: string, progress: number) => ({
  type: 'FILES/DOWNLOAD_PROGRESS',
  payload: {
    progress,
    cacheKey,
  },
})
