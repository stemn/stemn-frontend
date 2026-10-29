export interface IDownloadProgressAction {
  type: 'FILES/DOWNLOAD_PROGRESS'
  payload: { progress: number; cacheKey: string }
}

export const downloadProgress = (cacheKey: string, progress: number): IDownloadProgressAction => ({
  type: 'FILES/DOWNLOAD_PROGRESS',
  payload: {
    progress,
    cacheKey,
  },
})
