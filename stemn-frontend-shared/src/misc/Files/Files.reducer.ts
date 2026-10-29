import { produce } from 'immer'
import { AnyAction } from 'redux'
import { IFile } from 'stemn-shared/misc/FileList/types'
import { setIn } from 'stemn-shared/redux/draft'

export interface IFileRender {
  error?: string
  data?: any
  status?: string
  loading: boolean
}

export interface IFileData {
  data?: any
  error?: string
  loading: boolean
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
      data?: any
      loading: boolean
    }
  }
  previewMarkdown: boolean
}

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

function reducer(state: IFilesState, action: AnyAction): IFilesState {
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

export const filesReducer = (state: IFilesState = initialState, action: AnyAction) => {
  if (!state.hydrated) {
    state = { ...initialState, ...state, hydrated: true }
  }
  return reducer(state, action)
}
