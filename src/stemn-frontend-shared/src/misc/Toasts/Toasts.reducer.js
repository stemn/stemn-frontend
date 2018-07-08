import i from 'icepick'

const initialState = {
  stack: [],
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'TOAST/SHOW': {
      return i.merge(state, {
        stack: i.push(state.stack, action.payload),
      })
    }
    case 'TOAST/HIDE': {
      const index = state.stack.findIndex(toast => toast.id === action.payload.id)
      return i.merge(state, {
        stack: i.splice(state.stack, index, 1),
      })
    }
    default: {
      return state
    }
  }
}
