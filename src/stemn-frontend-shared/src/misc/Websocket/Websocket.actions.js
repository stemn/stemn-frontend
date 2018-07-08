import { get } from 'lodash'

export const joinRoom = ({ room, type }) => (dispatch, getState) => {
  const roomKey = `${type}-${room}`
  const alreadyConnected = get(getState(), ['websocket', 'rooms', roomKey, 'status'])

  if (!alreadyConnected) {
    dispatch({
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

export const leaveRoom = ({ room, type }) => (dispatch, getState) => {
  const roomKey = `${type}-${room}`
  const alreadyConnected = get(getState(), ['websocket', 'rooms', roomKey, 'status'])

  if (alreadyConnected) {
    dispatch({
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
