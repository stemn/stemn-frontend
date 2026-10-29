import { produce } from 'immer'
import type { UnknownAction } from 'redux'
import { IFile } from 'stemn-shared/misc/FileList/types'
import { setIn } from 'stemn-shared/redux/draft'
import type { FulfilledAction, HttpLifecycleActions, PendingAction, RejectedAction } from 'stemn-shared/redux/types'
import type {
  IDownloadProgressAction,
  IGetFileProgressAction,
  IRenderFileErrorAction,
  IRenderFileProgressAction,
  IRenderError,
} from './actions'

export interface IFileRender {
  error?: string
  /** The render: a URL (website) or a local path (desktop) */
  data?: string
  status?: string
  loading: boolean
}

export interface IFileData {
  /** The file content, depending on the request's responseType: text, parsed JSON or a blob URL ('path') */
  data?: unknown
  error?: string
  loading: boolean
  percentage?: number
}

export interface IFilesState {
  hydrated: boolean
  fileData: {
    [cacheKey: string]: IFileData
  }
  fileRenders: {
    [cacheKey: string]: IFileRender
  }
  fileMeta: {
    [cacheKey: string]: {
      data?: IFile
      status?: string
      loading?: boolean
    }
  }
  fileAssemblyParts: {
    [cacheKey: string]: IFileData
  }
  fileAssemblyParents: {
    [cacheKey: string]: IFileData
  }
  pathToId: {
    [path: string]: {
      data?: string
      loading: boolean
    }
  }
  downloadProgress: {
    [cacheKey: string]: number
  }
  relatedThreads: {
    [fileId: string]: {
      data?: unknown[]
      loading: boolean
    }
  }
  previewMarkdown: boolean
}

interface ICacheKeyMeta {
  cacheKey: string
}

/** The actions this reducer handles (redux-promise-middleware lifecycles and plain actions) */
export type FilesAction =
  | PendingAction<'FILES/GET_FILE', ICacheKeyMeta>
  | FulfilledAction<'FILES/GET_FILE', { data: unknown }, ICacheKeyMeta>
  // The reducer stores `payload.data`: an axios error has none (its body is in `response.data`)
  | RejectedAction<'FILES/GET_FILE', { data?: string }, ICacheKeyMeta>
  | IGetFileProgressAction
  | IRenderFileErrorAction
  | PendingAction<'FILES/RENDER_FILE_DOWNLOAD', ICacheKeyMeta>
  | FulfilledAction<'FILES/RENDER_FILE_DOWNLOAD', { data: string }, ICacheKeyMeta>
  | RejectedAction<'FILES/RENDER_FILE_DOWNLOAD', IRenderError, ICacheKeyMeta>
  | IRenderFileProgressAction
  | HttpLifecycleActions<'FILES/GET_META', IFile, ICacheKeyMeta>
  | HttpLifecycleActions<'FILES/GET_ASSEMBLY_PARTS', unknown, ICacheKeyMeta>
  | HttpLifecycleActions<'FILES/GET_ASSEMBLY_PARENTS', unknown, ICacheKeyMeta>
  | HttpLifecycleActions<'FILES/GET_RELATED_THREADS', unknown[], { fileId: string }>
  | HttpLifecycleActions<'FILES/GET_META_FROM_PATH', IFile, ICacheKeyMeta>
  | IDownloadProgressAction
  | { type: 'FILES/TOGGLE_PREVIEW_MARKDOWN' }

const initialState: IFilesState = {
  hydrated: false,
  fileData: {},
  fileRenders: {},
  fileMeta: {},
  fileAssemblyParts: {},
  fileAssemblyParents: {},
  pathToId: {},
  downloadProgress: {},
  relatedThreads: {},
  previewMarkdown: false,
}

function reducer(state: IFilesState, action: FilesAction): IFilesState {
  switch (action.type) {
    case 'FILES/GET_FILE_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['fileData', action.meta.cacheKey, 'loading'], true)
      })
    case 'FILES/GET_FILE_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['fileData', action.meta.cacheKey], {
          error: action.payload.data,
          loading: false,
        })
      })
    case 'FILES/GET_FILE_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['fileData', action.meta.cacheKey], {
          data: action.payload.data,
          loading: false,
        })
      })
    case 'FILES/GET_FILE_PROGRESS':
      return produce(state, (draft) => {
        setIn(draft, ['fileData', action.meta.cacheKey, 'percentage'], action.payload.percentage)
      })

    //    case 'FILES/RENDER_FILE_PENDING' :
    //      return i.assocIn(state, ['fileRenders', action.meta.cacheKey, 'loading'], true)
    case 'FILES/RENDER_FILE_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['fileRenders', action.meta.cacheKey], {
          error: action.payload.response.data.error,
          loading: false,
        })
      })
    //    case 'FILES/RENDER_FILE_FULFILLED' :
    //      const isRenderRequest = action.payload.data && action.payload.data.status;
    //      // If this was a render request, we do nothing - we wait for the websocket event to trigger the download
    //      return isRenderRequest ? state : i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
    //        data: action.payload.data,
    //        loading: false
    //      })
    case 'FILES/RENDER_FILE_DOWNLOAD_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['fileRenders', action.meta.cacheKey, 'loading'], true)
      })
    case 'FILES/RENDER_FILE_DOWNLOAD_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['fileRenders', action.meta.cacheKey], {
          error: action.payload.response.data.error,
          loading: false,
        })
      })
    case 'FILES/RENDER_FILE_DOWNLOAD_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['fileRenders', action.meta.cacheKey], {
          data: action.payload.data,
          loading: false,
        })
      })

    case 'FILES/RENDER_FILE_PROGRESS':
      return produce(state, (draft) => {
        setIn(draft, ['fileRenders', action.meta.cacheKey], {
          status: action.payload.message,
        })
      })

    case 'FILES/GET_META_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['fileMeta', action.meta.cacheKey, 'loading'], true)
      })
    case 'FILES/GET_META_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['fileMeta', action.meta.cacheKey, 'loading'], false)
      })
    case 'FILES/GET_META_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['fileMeta', action.meta.cacheKey], {
          data: action.payload.data,
          loading: false,
        })
      })

    case 'FILES/GET_ASSEMBLY_PARTS_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['fileAssemblyParts', action.meta.cacheKey, 'loading'], true)
      })
    case 'FILES/GET_ASSEMBLY_PARTS_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['fileAssemblyParts', action.meta.cacheKey, 'loading'], false)
      })
    case 'FILES/GET_ASSEMBLY_PARTS_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['fileAssemblyParts', action.meta.cacheKey], {
          data: action.payload.data,
          loading: false,
        })
      })

    case 'FILES/GET_ASSEMBLY_PARENTS_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['fileAssemblyParents', action.meta.cacheKey, 'loading'], true)
      })
    case 'FILES/GET_ASSEMBLY_PARENTS_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['fileAssemblyParents', action.meta.cacheKey, 'loading'], false)
      })
    case 'FILES/GET_ASSEMBLY_PARENTS_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['fileAssemblyParents', action.meta.cacheKey], {
          data: action.payload.data,
          loading: false,
        })
      })

    case 'FILES/GET_RELATED_THREADS_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['relatedThreads', action.meta.fileId, 'loading'], true)
      })
    case 'FILES/GET_RELATED_THREADS_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['relatedThreads', action.meta.fileId, 'loading'], false)
      })
    case 'FILES/GET_RELATED_THREADS_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['relatedThreads', action.meta.fileId], {
          data: action.payload.data,
          loading: false,
        })
      })

    case 'FILES/GET_META_FROM_PATH_PENDING':
      return produce(state, (draft) => {
        setIn(draft, ['pathToId', action.meta.cacheKey, 'loading'], true)
      })
    case 'FILES/GET_META_FROM_PATH_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, ['pathToId', action.meta.cacheKey, 'loading'], false)
      })
    case 'FILES/GET_META_FROM_PATH_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, ['pathToId', action.meta.cacheKey], { data: action.payload.data.fileId, loading: false })
        setIn(draft, ['fileMeta', action.meta.cacheKey], { data: action.payload.data, loading: false })
      })

    case 'FILES/DOWNLOAD_PROGRESS':
      return produce(state, (draft) => {
        setIn(draft, ['downloadProgress', action.payload.cacheKey], action.payload.progress)
      })

    case 'FILES/TOGGLE_PREVIEW_MARKDOWN': {
      return produce(state, (draft) => {
        draft.previewMarkdown = !state.previewMarkdown
      })
    }

    default:
      return state
  }
}

export const filesReducer = (state: IFilesState = initialState, action: FilesAction | UnknownAction): IFilesState => {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true }
  }
  // Every action of the app comes through here; the switch only reads the ones it knows
  return reducer(state, action as FilesAction)
}
