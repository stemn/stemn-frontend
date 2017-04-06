import i from 'icepick'
import { modeled } from 'react-redux-form'

const initialState = {
  tasks: {}
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'MENTIONS/':
      return state
    default:
      return state
  }
}
export default function (state = initialState, action) {
  return modeled(mainReducer, 'mentions')(state, action)
}
