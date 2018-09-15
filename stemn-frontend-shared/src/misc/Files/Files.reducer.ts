import * as i from 'icepick'
import { AnyAction } from 'redux'
import { IFile } from 'stemn-shared/misc/FileList/types'

export interface IFilesState {
  hydrated: boolean,
  fileData: {
    [cacheKey: string]: {
      data: any,
      loading: boolean,
    },
  },
  fileRenders: {
    [cacheKey: string]: {
      error?: string
      data?: any,
      status?: string,
      loading: boolean,
    },
  },
  fileMeta: {
    [cacheKey: string]: {
      data?: IFile,
      status?: string,
    },
  },
  fileAssemblyParts: {},
  fileAssemblyParents: {},
  pathToId: {
    [path: string]: {
      data?: string,
      loading: boolean,
    },
  },
  downloadProgress: {
    [cacheKey: string]: number,
  },
  relatedThreads: {
    [fileId: string]: {
      data?: any,
      loading: boolean,
    },
  },
  previewMarkdown: boolean,
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

function reducer (state: IFilesState, action: AnyAction) {
  switch (action.type) {
    case 'FILES/GET_FILE_PENDING' :
      return i.assocIn(state, ['fileData', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_FILE_REJECTED' :
      return i.assocIn(state, ['fileData', action.meta.cacheKey], {
        error: action.payload.data,
        loading: false,
      })
    case 'FILES/GET_FILE_FULFILLED' :
      return i.assocIn(state, ['fileData', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false,
      })
    case 'FILES/GET_FILE_PROGRESS':
      return i.assocIn(state, ['fileData', action.meta.cacheKey, 'percentage'], action.payload.percentage)

      //    case 'FILES/RENDER_FILE_PENDING' :
      //      return i.assocIn(state, ['fileRenders', action.meta.cacheKey, 'loading'], true)
    case 'FILES/RENDER_FILE_REJECTED' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
        error: action.payload.response.data.error,
        loading: false,
      })
      //    case 'FILES/RENDER_FILE_FULFILLED' :
      //      const isRenderRequest = action.payload.data && action.payload.data.status;
      //      // If this was a render request, we do nothing - we wait for the websocket event to trigger the download
      //      return isRenderRequest ? state : i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
      //        data: action.payload.data,
      //        loading: false
      //      })
    case 'FILES/RENDER_FILE_DOWNLOAD_PENDING' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey, 'loading'], true)
    case 'FILES/RENDER_FILE_DOWNLOAD_REJECTED' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
        error: action.payload.response.data.error,
        loading: false,
      })
    case 'FILES/RENDER_FILE_DOWNLOAD_FULFILLED' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false,
      })

    case 'FILES/RENDER_FILE_PROGRESS' :
      return i.assocIn(state, ['fileRenders', action.meta.cacheKey], {
        status: action.payload.message,
      })

    case 'FILES/GET_META_PENDING' :
      return i.assocIn(state, ['fileMeta', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_META_REJECTED' :
      return i.assocIn(state, ['fileMeta', action.meta.cacheKey, 'loading'], false)
    case 'FILES/GET_META_FULFILLED' :
      return i.assocIn(state, ['fileMeta', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false,
      })

    case 'FILES/GET_ASSEMBLY_PARTS_PENDING' :
      return i.assocIn(state, ['fileAssemblyParts', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_ASSEMBLY_PARTS_REJECTED' :
      return i.assocIn(state, ['fileAssemblyParts', action.meta.cacheKey, 'loading'], false)
    case 'FILES/GET_ASSEMBLY_PARTS_FULFILLED' :
      return i.assocIn(state, ['fileAssemblyParts', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false,
      })

    case 'FILES/GET_ASSEMBLY_PARENTS_PENDING' :
      return i.assocIn(state, ['fileAssemblyParents', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_ASSEMBLY_PARENTS_REJECTED' :
      return i.assocIn(state, ['fileAssemblyParents', action.meta.cacheKey, 'loading'], false)
    case 'FILES/GET_ASSEMBLY_PARENTS_FULFILLED' :
      return i.assocIn(state, ['fileAssemblyParents', action.meta.cacheKey], {
        data: action.payload.data,
        loading: false,
      })

    case 'FILES/GET_RELATED_THREADS_PENDING' :
      return i.assocIn(state, ['relatedThreads', action.meta.fileId, 'loading'], true)
    case 'FILES/GET_RELATED_THREADS_REJECTED' :
      return i.assocIn(state, ['relatedThreads', action.meta.fileId, 'loading'], false)
    case 'FILES/GET_RELATED_THREADS_FULFILLED' :
      return i.assocIn(state, ['relatedThreads', action.meta.fileId], {
        data: action.payload.data,
        loading: false,
      })

    case 'FILES/GET_META_FROM_PATH_PENDING' :
      return i.assocIn(state, ['pathToId', action.meta.cacheKey, 'loading'], true)
    case 'FILES/GET_META_FROM_PATH_REJECTED' :
      return i.assocIn(state, ['pathToId', action.meta.cacheKey, 'loading'], false)
    case 'FILES/GET_META_FROM_PATH_FULFILLED' :
      return i.chain(state)
        .assocIn(['pathToId', action.meta.cacheKey], {
          data: action.payload.data.fileId,
          loading: false,
        })
        .assocIn(['fileMeta', action.meta.cacheKey], {
          data: action.payload.data,
          loading: false,
        })
        .value()

    case 'FILES/DOWNLOAD_PROGRESS' :
      return i.assocIn(state, ['downloadProgress', action.payload.cacheKey], action.payload.progress)

    case 'FILES/TOGGLE_PREVIEW_MARKDOWN': {
      return i.updateIn(state, ['previewMarkdown'], (previewMarkdown) => !previewMarkdown)
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
