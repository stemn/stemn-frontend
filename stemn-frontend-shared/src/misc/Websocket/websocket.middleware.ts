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

import type { StemnMiddleware } from 'stemn-shared/redux/types'
import { socket } from './websocket'

/** An action for this middleware: `payload` is the message to send */
export interface IWebsocketAction {
  type?: string
  websocket: boolean
  payload: { type: string; payload?: object }
}

const isWebsocketAction = (action: unknown): action is IWebsocketAction =>
  !!action && !!(action as Partial<IWebsocketAction>).websocket

// The token is sent with every message
const websocketMiddleware: StemnMiddleware<{ auth: { authToken: string | null } }> = (store) => (next) => (action) => {
  const token = store.getState().auth.authToken
  if (isWebsocketAction(action) && socket && action.payload) {
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

export default websocketMiddleware
