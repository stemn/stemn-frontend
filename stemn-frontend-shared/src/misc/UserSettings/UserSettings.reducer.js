import { produce } from 'immer'

const initialState = {
  data: {
    emails: {},
    feed: {},
    notifications: {},
    messages: {},
    tips: {},
  },
  loading: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'USER_SETTINGS/GET_SETTINGS_PENDING': {
      return produce(state, (draft) => {
        draft.loading = true
      })
    }
    case 'USER_SETTINGS/GET_SETTINGS_REJECTED': {
      return produce(state, (draft) => {
        draft.loading = false
      })
    }
    case 'USER_SETTINGS/GET_SETTINGS_FULFILLED': {
      return produce(state, (draft) => {
        draft.loading = false
        draft.data = action.payload.data
      })
    }
    default:
      return state
  }
}
