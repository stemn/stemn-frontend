import websocketJoinFile from './websocketJoinFile.js';
import getUuid from 'stemn-shared/utils/getUuid.js';
import http from 'axios';

export default ({projectId, fileId, revisionId, provider, timestamp}) => {
  const cacheKey = timestamp ? `${fileId}-${revisionId}-${timestamp}` : `${fileId}-${revisionId}`;
  // The cache key is used as the renderId/roomId
  return (dispatch) => {
//    dispatch({
//      type: 'FILES/RENDER_FILE',
//      payload: http(`/api/v1/sync/downloadRenderFile/${projectId}/${fileId}/${revisionId}`)
//        .then((response) => ({
//          data: response.request.responseURL
//        })),
//      meta: {
//        cacheKey
//      }
//    });
    dispatch({
      type: 'FILES/RENDER_FILE',
      http: true,
      payload: {
        url: projectId
          ? `/api/v1/sync/render/${projectId}/${fileId}`
          : `/api/v1/remote/render/${provider}/${fileId}`,
      },
      meta: {
        cacheKey,
      }
    });

    // Join the websocket room
    dispatch(websocketJoinFile({renderId: cacheKey}))
  }
}

