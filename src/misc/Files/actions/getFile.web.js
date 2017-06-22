import http from 'axios'

export default ({ projectId, fileId, revisionId, provider, responseType }) => {
  const cacheKey = `${fileId}-${revisionId}`

  // If the response type is path, we change it to blob and create
  // a filepath in the then statement
  return {
    type: 'FILES/GET_FILE',
    payload: http({
      url: projectId
        ? `/api/v1/sync/download/${projectId}/${fileId}`
        : `/api/v1/remote/download/${provider}/${fileId}`,
      params: { revisionId },
      responseType: responseType === 'path' ? 'blob' : responseType,
    }).then((response) => {
      if (responseType === 'path') {
        response.data = window.URL.createObjectURL(response.data)
      }
      return response
    }),
    meta: {
      cacheKey,
    },
  }
}
