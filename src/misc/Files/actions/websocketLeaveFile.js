export default ({fileId}) => {
  return (dispatch, getState) => {
    const alreadyConnected = getState().files.websocketRooms.includes(fileId);
    if(alreadyConnected){
      dispatch({
        type      : 'FILES/WEBSOCKET_LEAVE_FILE',
        websocket : true,
        payload   : {
          type    : 'ROOM/LEAVE',
          payload : {
            room  : fileId,
            type  : 'file'
          }
        }
      });
    }
  }
}
