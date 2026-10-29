import { get } from 'lodash'
import type { ISharedStoreState, StemnThunk } from 'stemn-shared/redux/types'

/** The kinds of websocket rooms the server knows */
export type RoomType = 'user' | 'project' | 'board' | 'thread' | 'render' | 'pipeline' | 'step'

export interface IRoom {
  room: string
  type: RoomType
}

/** A websocket message for the server (sent by the websocket middleware, see ./websocket.middleware) */
export interface IRoomMessage {
  type: 'ROOM/JOIN' | 'ROOM/LEAVE'
  payload: IRoom
}

export interface IJoinRoomAction {
  type: 'WEBSOCKET/JOIN_ROOM'
  websocket: true
  payload: IRoomMessage & { type: 'ROOM/JOIN' }
  meta: IRoom & { roomKey: string }
}

export interface ILeaveRoomAction {
  type: 'WEBSOCKET/LEAVE_ROOM'
  websocket: true
  payload: IRoomMessage & { type: 'ROOM/LEAVE' }
  meta: IRoom & { roomKey: string }
}

type WebsocketThunk = StemnThunk<void, Pick<ISharedStoreState, 'websocket'>>

export const joinRoom =
  ({ room, type }: IRoom): WebsocketThunk =>
  (dispatch, getState) => {
    const roomKey = `${type}-${room}`
    const alreadyConnected = get(getState(), ['websocket', 'rooms', roomKey, 'status'])

    if (!alreadyConnected) {
      dispatch<IJoinRoomAction>({
        type: 'WEBSOCKET/JOIN_ROOM',
        websocket: true,
        payload: {
          type: 'ROOM/JOIN',
          payload: {
            room,
            type,
          },
        },
        meta: {
          roomKey,
          room,
          type,
        },
      })
    }
  }

export const leaveRoom =
  ({ room, type }: IRoom): WebsocketThunk =>
  (dispatch, getState) => {
    const roomKey = `${type}-${room}`
    const alreadyConnected = get(getState(), ['websocket', 'rooms', roomKey, 'status'])

    if (alreadyConnected) {
      dispatch<ILeaveRoomAction>({
        type: 'WEBSOCKET/LEAVE_ROOM',
        websocket: true,
        payload: {
          type: 'ROOM/LEAVE',
          payload: {
            room,
            type,
          },
        },
        meta: {
          roomKey,
          room,
          type,
        },
      })
    }
  }
