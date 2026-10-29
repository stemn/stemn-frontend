import http from 'axios'

/**
 * The download endpoints send no Content-Type, so the browser types the blob from its content
 * (an SVG becomes `text/xml`) and an <img> with that blob URL renders nothing. Raster formats
 * render whatever the blob type is; SVG needs `image/svg+xml`.
 */
const withSvgType = async (blob: Blob) => {
  if (blob.type.startsWith('image/')) return blob
  const head = await blob.slice(0, 1024).text()
  return /<svg[\s>]/i.test(head) ? new Blob([blob], { type: 'image/svg+xml' }) : blob
}

export const getFile = ({ projectId, fileId, revisionId = '', provider, responseType }) => {
  const cacheKey = `${fileId}-${revisionId}`

  // If the response type is path, we change it to blob and create
  // a filepath in the then statement
  return {
    type: 'FILES/GET_FILE',
    payload: http({
      url: projectId
        ? `/api/v1/sync/download/${projectId}/${fileId}/${revisionId}`
        : `/api/v1/remote/download/${provider}/${fileId}/${revisionId}`,
      responseType: responseType === 'path' ? 'blob' : responseType,
    }).then(async (response) => {
      if (responseType === 'path') {
        response.data = window.URL.createObjectURL(await withSvgType(response.data))
      }
      return response
    }),
    meta: {
      cacheKey,
    },
  }
}
