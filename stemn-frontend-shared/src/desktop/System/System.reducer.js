import { produce } from 'immer'
import { mergeDeep, setIn } from 'stemn-shared/redux/draft'

const initialState = {
  installed: false,
  providerPath: {
    dropbox: null,
    drive: null,
    onedrive: null,
  },
  settings: {
    usageData: true,
    autoUpdate: true,
    debug: false,
  },
}

function reducer(state, action) {
  switch (action.type) {
    case 'SYSTEM/GET_PROVIDER_PATH_FULFILLED': {
      return produce(state, (draft) => {
        setIn(draft, ['providerPath', action.meta.provider], action.payload)
      })
    }
    case 'SYSTEM/GET_INSTALL_STATUS_FULFILLED': {
      return produce(state, (draft) => {
        draft.installed = action.payload
      })
    }
    case 'SYSTEM/GET_INSTALL_STATUS_REJECTED': {
      return produce(state, (draft) => {
        draft.installed = action.payload
      })
    }
    default:
      return state
  }
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    const persistedState = state
    state = produce(initialState, (draft) => {
      mergeDeep(draft, persistedState)
      draft.hydrated = true
    })
  }
  return reducer(state, action)
}
