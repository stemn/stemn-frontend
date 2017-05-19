import websocketJoinFile from './websocketJoinFile.js'
import http from 'axios';

export default ({projectId, fileId, revisionId, provider, timestamp}) => (dispatch) => {
  const cacheKey = timestamp ? `${fileId}-${revisionId}-${timestamp}` : `${fileId}-${revisionId}`;
  // Join the websocket room
  dispatch(websocketJoinFile({renderId: cacheKey}))
  // The cache key is used as the renderId/roomId
  dispatch({
    type: 'FILES/RENDER_FILE',
    http: true,
    payload: {
      url: projectId
        ? `/api/v1/sync/render/${projectId}/${fileId}`
        : `/api/v1/remote/render/${provider}/${fileId}`,
      params: {
        revisionId,
        timestamp,
        roomId: cacheKey
      },
    },
    meta: {
      cacheKey,
    }
  })
}

