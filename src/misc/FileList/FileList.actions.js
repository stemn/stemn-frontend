import http from 'axios'

export function fetchFiles({projectId, path, options}) {
  return {
    type: 'FILE_LIST/FETCH_FILES',
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/sync/listFolder/${projectId}/${path}`
    },
    meta: {
      key: `${projectId}-${path}`,
    },
    throttle: {
      time: 500,
      endpoint:  `${projectId}/${path}`
    },
  };
}

export function exploreFolder({folderId, provider}) {
  return {
    type: 'FILE_LIST/EXPLORE_FOLDER',
    payload: http({
      method: 'GET',
      url: `/api/v1/remote/explore/${provider}/${folderId}`
    }),
    meta: {
      key: `${provider}-${folderId}`,
    },
    throttle: {
      time: 500,
      endpoint:  `${provider}/${folderId}`
    },
  };
}


//export const joinRoom = ({fileId}) => {
//  return (dispatch, getState) => {
//    const alreadyConnected = getState().fileList.websocketRooms.includes(fileId);
//    if(!alreadyConnected){
//      dispatch({
//        type      : 'FILE_LIST/WEBSOCKET_JOIN_FILE',
//        websocket : true,
//        payload   : {
//          type    : 'ROOM/JOIN',
//          payload : {
//            room  : fileId,
//            type  : 'file'
//          }
//        }
//      });
//    }
//  }
//}
//
//export const leaveRoom = ({fileId}) => {
//  return (dispatch, getState) => {
//    const alreadyConnected = getState().fileList.websocketRooms.includes(fileId);
//    if(alreadyConnected){
//      dispatch({
//        type      : 'FILE_LIST/WEBSOCKET_LEAVE_FILE',
//        websocket : true,
//        payload   : {
//          type    : 'ROOM/LEAVE',
//          payload : {
//            room  : fileId,
//            type  : 'file'
//          }
//        }
//      });
//    }
//  }
//}
