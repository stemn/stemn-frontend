import { produce } from 'immer'
import { mergeDeep, setIn } from 'stemn-shared/redux/draft'

const initialState = {
  currentVersion: null,

  /** Feed being polled (AUTO_UPDATE/CONFIGURED) */
  channel: null,
  edition: null,
  provider: null,

  checkingForUpdate: false,
  updateAvailable: false,
  updateDownloaded: false,
  /** Newest version on the feed: { version, releaseNotes, releaseDate, autoDownload } */
  available: null,
  /** Download progress in percent while downloading */
  progress: null,
  /** The downloaded update: { update, version, platform, readme } */
  release: {},
  updateError: false,
  updateNotAvailable: false,
  /** Last refused quitAndInstall: { reason, message } */
  installRefused: null,

  /** Commits in flight ({ [projectId]: true }): the update is not installed while one is pending */
  pendingCommits: {},
}

function reducer(state, action) {
  switch (action.type) {
    case 'AUTO_UPDATE/CURRENT_VERSION': {
      return produce(state, (draft) => {
        draft.currentVersion = action.payload.version
      })
    }
    case 'AUTO_UPDATE/CONFIGURED': {
      const { channel, edition, provider } = action.payload
      return produce(state, (draft) => {
        mergeDeep(draft, { channel, edition, provider })
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
    case 'AUTO_UPDATE/CHECKING': {
      return produce(state, (draft) => {
        mergeDeep(draft, {
          checkingForUpdate: true,
          updateError: false,
          updateNotAvailable: false,
        })
      })
    }
    case 'AUTO_UPDATE/UPDATE_AVAILABLE': {
      const payload = action.payload || {}
      return produce(state, (draft) => {
        mergeDeep(draft, {
          updateAvailable: true,
          checkingForUpdate: false,
        })
        if (payload.version) {
          setIn(draft, ['available'], {
            version: payload.version,
            releaseNotes: payload.releaseNotes || '',
            releaseDate: payload.releaseDate || null,
            autoDownload: !!payload.autoDownload,
          })
        }
      })
    }
    case 'AUTO_UPDATE/DOWNLOAD_PROGRESS': {
      return produce(state, (draft) => {
        draft.progress = Math.round(action.payload.percent || 0)
      })
    }
    case 'AUTO_UPDATE/UPDATE_DOWNLOADED': {
      const { update, version, platform, readme } = action.payload
      return produce(state, (draft) => {
        draft.updateDownloaded = true
        draft.release = { update, version, platform, readme }
        draft.progress = null
        draft.checkingForUpdate = false
      })
    }
    case 'AUTO_UPDATE/INSTALL_REFUSED': {
      const { reason, message } = action.payload
      return produce(state, (draft) => {
        draft.installRefused = { reason, message }
      })
    }
    case 'AUTO_UPDATE/UPDATE_ERROR': {
      console.log('error:', action.payload)
      return produce(state, (draft) => {
        mergeDeep(draft, {
          updateError: action.payload,
          checkingForUpdate: false,
        })
        draft.progress = null
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
    // Commits in flight (CHANGES/COMMIT is a redux-promise-middleware action keyed by meta.cacheKey = projectId)
    case 'CHANGES/COMMIT_PENDING': {
      const projectId = action.meta && action.meta.cacheKey
      if (!projectId) return state
      return produce(state, (draft) => {
        setIn(draft, ['pendingCommits', projectId], true)
      })
    }
    case 'CHANGES/COMMIT_FULFILLED':
    case 'CHANGES/COMMIT_REJECTED': {
      const projectId = action.meta && action.meta.cacheKey
      if (!projectId || !state.pendingCommits || !state.pendingCommits[projectId]) return state
      return produce(state, (draft) => {
        delete draft.pendingCommits[projectId]
        if (draft.installRefused && draft.installRefused.reason === 'commit-in-progress') {
          draft.installRefused = null
        }
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
