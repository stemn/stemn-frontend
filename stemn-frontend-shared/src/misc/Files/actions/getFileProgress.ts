export interface IGetFileProgressAction {
  type: 'FILES/GET_FILE_PROGRESS'
  payload: { percentage: number }
  meta: { cacheKey: string }
}

export const getFileProgress = ({
  percentage,
  cacheKey,
}: {
  percentage: number
  cacheKey: string
}): IGetFileProgressAction => ({
  type: 'FILES/GET_FILE_PROGRESS',
  payload: {
    percentage,
  },
  meta: {
    cacheKey,
  },
})
