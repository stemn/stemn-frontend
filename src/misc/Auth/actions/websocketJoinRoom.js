export default ({userId}) => {
  return {
    type: 'AUTH/WEBSOCKET_JOIN_ROOM',
    websocket: true,
    payload: {
      type : 'ROOM/JOIN',
      payload : {
        room : userId,
        type : 'user'
      }
    }
  };
}