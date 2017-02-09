import websocketJoinFile from './websocketJoinFile.js';
import getUuid from 'stemn-shared/utils/getUuid.js';

export default ({projectId, fileId, revisionId, provider, timestamp}) => {
  const cacheKey = timestamp ? `${fileId}-${revisionId}-${timestamp}` : `${fileId}-${revisionId}`;
  // Create a render id. This will be used to create a websocket room to get status events.
  const renderId = getUuid();

  return (dispatch) => {
    dispatch({
      type: 'FILES/RENDER_FILE',
      aliased: true,
      payload: {
        functionAlias: 'FileCache.get',
        functionInputs: {
          key          : cacheKey,
          renderUrl    : projectId
                         ? `/api/v1/sync/render/${projectId}/${fileId}`
                         : `/api/v1/remote/render/${provider}/${fileId}`,
          url          : projectId
                         ? `/api/v1/sync/downloadRender/${projectId}/${fileId}`
                         : `/api/v1/remote/downloadRender/${provider}/${fileId}`,
          params       : { revisionId, timestamp, roomId: renderId },
          name         : cacheKey,
          responseType : 'path',
          extract      : true
        }
      },
      meta: {
        cacheKey
      }
    });

    // Join the websocket room
    dispatch(websocketJoinFile({renderId}))
  }
}
