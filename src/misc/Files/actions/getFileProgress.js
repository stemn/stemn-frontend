export default ({percentage, cacheKey}) => {
  return {
    type: 'FILES/GET_FILE_PROGRESS',
    payload: {
      percentage
    },
    meta: {
      cacheKey,
    }
  }
}