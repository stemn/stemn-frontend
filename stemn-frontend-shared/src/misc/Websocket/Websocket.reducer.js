import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {
  rooms: {},
}

export default (state = initialState, action = {}) => {
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
