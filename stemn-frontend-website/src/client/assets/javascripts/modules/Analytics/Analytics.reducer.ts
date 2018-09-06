import { page } from './'

const initialState = {}

export const analyticsReducer = (state = initialState, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      if (!action.payload.hash) {
        setTimeout(() => page(), 200)
      }
      return state
    }

    default:
      return state
  }
}
