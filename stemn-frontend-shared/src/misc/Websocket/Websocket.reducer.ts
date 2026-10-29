import { produce } from 'immer'
import type { UnknownAction } from 'redux'
import { setIn } from 'stemn-shared/redux/draft'
import type { IJoinRoomAction, ILeaveRoomAction, IRoom } from './Websocket.actions'

export interface IWebsocketState {
  /** Rooms by `${type}-${room}` */
  rooms: { [roomKey: string]: IRoom & { status: boolean } }
}

const initialState: IWebsocketState = {
  rooms: {},
}

export type WebsocketAction = IJoinRoomAction | ILeaveRoomAction

export default (
  state: IWebsocketState = initialState,
  incoming: WebsocketAction | UnknownAction = {} as UnknownAction,
): IWebsocketState => {
  // Every action of the app comes through here; the switch only reads the ones it knows
  const action = incoming as WebsocketAction
  switch (action.type) {
    case 'WEBSOCKET/JOIN_ROOM': {
      return produce(state, (draft) => {
        setIn(draft, ['rooms', action.meta.roomKey], {
          room: action.meta.room,
          type: action.meta.type,
          status: true,
        })
      })
    }
    case 'WEBSOCKET/LEAVE_ROOM': {
      return produce(state, (draft) => {
        setIn(draft, ['rooms', action.meta.roomKey, 'status'], false)
      })
    }
    default: {
      return state
    }
  }
}
