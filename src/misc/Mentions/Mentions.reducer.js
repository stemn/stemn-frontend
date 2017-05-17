import i from 'icepick'

const initialState = {
  tasks: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'MENTIONS/':
      return state
    default:
      return state
  }
}
