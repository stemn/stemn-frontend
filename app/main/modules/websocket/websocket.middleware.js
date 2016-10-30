/**********************************************

This middleware is used to send websocket writes
It will execute in the main thread.

Action should be of the form:
{
  type: 'REDUX ACTION TYPE' (optional)
  websocket: true, (this will enable this middleware),
  payload: {
    type: 'some websocker actionType'
    payload: {}  - Some websocket payload
  }
}

**********************************************/

import { socket } from './websocket.js';

export default store => next => action => {
  if(action.websocket && socket) {
    socket.write(action.payload)
    return next(action);
  }
  else{
    return next(action);
  }
};
