/** ********************************************

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

********************************************* */

import { socket } from './websocket.js'

export default store => next => (action) => {
  const token = store.getState().auth.authToken
  if (action && action.websocket && socket && action.payload) {
    socket.write({
      type: action.payload.type,
      payload: Object.assign({}, action.payload.payload, {
        token,
      }),
    })

    // Modify the action so the websocket is not processed again
    const modifiedAction = Object.assign({}, action, { websocket: false })
    return next(modifiedAction)
  }
  
  return next(action)
}
