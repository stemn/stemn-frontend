import i from 'icepick'
export const name = 'autoLaunch'

const initialState = {
  status: false,
}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'AUTO_LAUNCH/GET_STATUS_FULFILLED':
      return i.assoc(state, 'status', action.payload)
    case 'AUTO_LAUNCH/TOGGLE_FULFILLED':
      return i.assoc(state, 'status', action.meta.status)
    default:
      return state
  }
}
