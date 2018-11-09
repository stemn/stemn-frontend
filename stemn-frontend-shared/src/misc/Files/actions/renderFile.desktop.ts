import { joinRoom } from 'stemn-shared/misc/Websocket/Websocket.actions';

export const renderFile = ({ projectId, fileId, revisionId, provider, timestamp }) => (dispatch) => {
  // The cache key is used as the renderId/roomId
  const cacheKey = timestamp ? `${fileId}-${revisionId}-${timestamp}` : `${fileId}-${revisionId}`

  console.log(joinRoom)

  // Join the websocket room
  dispatch(joinRoom({
    room: cacheKey,
    type: 'render',
  }))

  dispatch({
    type: 'FILES/RENDER_FILE',
    websocket: true,
    payload: {
      type: 'RENDER/RENDER_FILE',
      payload: {
        fileId,
        revisionId,
        timestamp,
        projectId,
        roomId: cacheKey,
      },
    },
    meta: {
      cacheKey,
    },
  })
}

//    dispatch({
//      type: 'FILES/RENDER_FILE',
//      aliased: true,
//      payload: {
//        functionAlias: 'FileCache.get',
//        functionInputs: {
//          key          : cacheKey,
//          renderUrl    : projectId
//                         ? `/api/v1/sync/render/${projectId}/${fileId}`
//                         : `/api/v1/remote/render/${provider}/${fileId}`,
//          url          : projectId
//                         ? `/api/v1/sync/downloadRender/${projectId}/${fileId}`
//                         : `/api/v1/remote/downloadRender/${provider}/${fileId}`,
//          params       : { revisionId, timestamp, roomId: cacheKey },
//          name         : cacheKey,
//          responseType : 'path',
//          extract      : true
//        }
//      },
//      meta: {
//        cacheKey
//      }
//    });

// `http://35.167.249.144/api/v1/sync/downloadRenderFile/${projectId}/${fileId}/${revisionId}`
