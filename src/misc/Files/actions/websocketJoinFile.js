export default ({fileId}) => {
  return (dispatch, getState) => {
    const alreadyConnected = getState().files.websocketRooms.includes(fileId);
    if(!alreadyConnected){
      dispatch({
        type      : 'FILES/WEBSOCKET_JOIN_FILE',
        websocket : true,
        payload   : {
          type    : 'ROOM/JOIN',
          payload : {
            room  : fileId,
            type  : 'file'
          }
        }
      });
    }
  }
}