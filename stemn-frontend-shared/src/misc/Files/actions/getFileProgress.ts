export const getFileProgress = ({ percentage, cacheKey }) => ({
  type: 'FILES/GET_FILE_PROGRESS',
  payload: {
    percentage,
  },
  meta: {
    cacheKey,
  },
})
