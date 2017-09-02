import { joinRoom } from 'stemn-shared/misc/Websocket/Websocket.actions'

export default ({ projectId, fileId, revisionId, provider, timestamp }) => (dispatch) => {
  // The cache key is used as the renderId/roomId
  const cacheKey = timestamp ? `${fileId}-${revisionId}-${timestamp}` : `${fileId}-${revisionId}`

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


//  dispatch({
//    type: 'FILES/RENDER_FILE',
//    http: true,
//    payload: {
//      url: projectId
//        ? `/api/v1/sync/render/${projectId}/${fileId}`
//        : `/api/v1/remote/render/${provider}/${fileId}`,
//      params: {
//        revisionId,
//        timestamp,
//        roomId: cacheKey
//      },
//    },
//    meta: {
//      cacheKey,
//    }
//  })
