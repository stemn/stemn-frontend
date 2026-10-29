import { produce } from 'immer'
import { mergeDeep } from 'stemn-shared/redux/draft'

const initialState = {
  currentVersion: null,

  checkingForUpdate: false,
  updateAvailable: false,
  updateDownloaded: false,
  release: {},
  updateError: false,
  updateNotAvailable: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'AUTO_UPDATE/CURRENT_VERSION': {
      return produce(state, (draft) => {
        draft.currentVersion = action.payload.version
      })
    }
    case 'AUTO_UPDATE/CHECK_FOR_UPDATES': {
      return produce(state, (draft) => {
        mergeDeep(draft, {
          checkingForUpdate: true,
          updateAvailable: false,
          updateDownloaded: false,
          release: {},
          updateError: false,
          updateNotAvailable: false,
        })
      })
    }
    case 'AUTO_UPDATE/UPDATE_AVAILABLE': {
      return produce(state, (draft) => {
        mergeDeep(draft, {
          updateAvailable: true,
          checkingForUpdate: false,
        })
      })
    }
    case 'AUTO_UPDATE/UPDATE_DOWNLOADED': {
      const { update, version, platform, readme } = action.payload
      return produce(state, (draft) => {
        draft.updateDownloaded = true
        draft.release = { update, version, platform, readme }
      })
    }
    case 'AUTO_UPDATE/UPDATE_ERROR': {
      console.log('error:', action.payload)
      return produce(state, (draft) => {
        mergeDeep(draft, {
          updateError: action.payload,
          checkingForUpdate: false,
        })
      })
    }
    case 'AUTO_UPDATE/UPDATE_NOT_AVAILABLE': {
      return produce(state, (draft) => {
        mergeDeep(draft, {
          updateNotAvailable: true,
          checkingForUpdate: false,
        })
      })
    }
    default:
      return state
  }
}

export default function (state = initialState, action) {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true }
  }
  return reducer(state, action)
}
