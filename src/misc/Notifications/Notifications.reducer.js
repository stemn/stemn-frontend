import i from 'icepick'

const initialState = {}

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case 'NOTIFICATIONS/GET_NOTIFICATIONS':
      return i.assocIn(state, data, action.payload.data)

    default:
      return state
  }
}
