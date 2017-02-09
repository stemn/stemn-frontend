export default ({fileId, renderId}) => {
  return (dispatch, getState) => {
    const room = renderId ? renderId : fileId;
    const alreadyConnected = getState().files.websocketRooms.includes(room);
    if(alreadyConnected){
      dispatch({
        type      : 'FILES/WEBSOCKET_LEAVE_FILE',
        websocket : true,
        payload   : {
          type    : 'ROOM/LEAVE',
          payload : {
            room  : room,
            type  : renderId ? 'render' : 'file'
          }
        }
      });
    }
  }
}
