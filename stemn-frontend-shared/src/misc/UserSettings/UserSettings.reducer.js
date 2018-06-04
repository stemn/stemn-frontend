import i from 'icepick'

const initialState = {
  data: {
    emails: {},
    feed: {},
    notifications: {},
    messages: {},
    tips: {},
  },
  loading: false,
  previewMarkdown: false,
}

export default (state = initialState, action) => {
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
    case 'USER_SETTINGS/TOGGLE_PREVIEW_MARKDOWN': {
      return i.updateIn(state, ['previewMarkdown'], previewMarkdown => !previewMarkdown)
    }
    default:
      return state
  }
}