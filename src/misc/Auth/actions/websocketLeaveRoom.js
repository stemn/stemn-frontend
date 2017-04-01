export default ({userId}) => {
  return {
    type: 'AUTH/WEBSOCKET_LEAVE_ROOM',
    websocket: true,
    payload: {
      type : 'ROOM/LEAVE',
      payload : {
        room : userId,
        type : 'user'
      }
    }
  };
}
