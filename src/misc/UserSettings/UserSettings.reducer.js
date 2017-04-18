import i from 'icepick'
import { modeled } from 'react-redux-form'

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

function reducer(state, action) {
  switch (action.type) {
    case 'USER_SETTINGS/GET_SETTINGS_PENDING': {
      return i.assoc(state, 'loading', true)
    }
    case 'USER_SETTINGS/GET_SETTINGS_REJECTED': {
      return i.assoc(state, 'loading', false)
    }
    case 'USER_SETTINGS/GET_SETTINGS_FULFILLED': {
      return i.chain(state)
        .assoc('loading', false)
        .assoc('data', action.payload.data)
        .value()
    }
    default:
      return state
  }
}

export default function (state = initialState, action) {
  return modeled(reducer, 'userSettings')(state, action)
}
