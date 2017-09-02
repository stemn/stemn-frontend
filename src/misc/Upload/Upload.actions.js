import http from 'axios'

export function upload({ cacheKey, files }) {
  return (dispatch) => {
    // Create the data object
    const data = new FormData()
    files.forEach(file => data.append('file', file))

    // Submit it
    return dispatch({
      type: 'UPLOAD/UPLOAD',
      payload: http({
        method: 'POST',
        url: '/api/v1/uploads',
        data,
        onUploadProgress(progressEvent) {
          const percentage = progressEvent.loaded / progressEvent.total
          dispatch(progress({ percentage, cacheKey }))
        },
      }),
      meta: {
        cacheKey,
        files,
      },
    })
  }
}

export const reset = ({ cacheKey }) => ({
  type: 'UPLOAD/RESET',
  meta: {
    cacheKey,
  },
})

export function progress({ percentage, cacheKey }) {
  return {
    type: 'UPLOAD/PROGRESS',
    payload: {
      percentage,
    },
    meta: {
      cacheKey,
    },
  }
}
