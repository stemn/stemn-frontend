import { produce } from 'immer'

const initialState = {
  stack: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'TOAST/SHOW': {
      return produce(state, (draft) => {
        draft.stack.push(action.payload)
      })
    }
    case 'TOAST/HIDE': {
      const index = state.stack.findIndex((toast) => toast.id === action.payload.id)
      return produce(state, (draft) => {
        draft.stack.splice(index, 1)
      })
    }
    default: {
      return state
    }
  }
}
