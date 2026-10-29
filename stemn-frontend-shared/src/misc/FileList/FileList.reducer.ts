import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'
import { AnyAction } from 'redux'
import { IFile, IFolder } from './types'

export interface IFileListState {
  [cacheKey: string]: {
    /** Array of entries */
    entries: IFile[]
    /** Info about the folder we are searching */
    folder: IFolder
    /** Search query */
    query: string
  }
}

const initialState: IFileListState = {}

export const fileListReducer = (state: IFileListState = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'FILE_LIST/FETCH_FILES_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], true)
      })
    case 'FILE_LIST/FETCH_FILES_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    case 'FILE_LIST/FETCH_FILES_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'entries'], action.payload.data.entries)
        setIn(draft, [action.meta.cacheKey, 'folder'], action.payload.data.folder)
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })

    case 'FILE_LIST/EXPLORE_FOLDER_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], true)
      })
    case 'FILE_LIST/EXPLORE_FOLDER_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    case 'FILE_LIST/EXPLORE_FOLDER_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'entries'], action.payload.data.entries)
        setIn(draft, [action.meta.cacheKey, 'folder'], action.payload.data.folder)
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })

    case 'FILE_LIST/SEARCH_PENDING':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], true)
      })
    case 'FILE_LIST/SEARCH_REJECTED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })
    case 'FILE_LIST/SEARCH_FULFILLED':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'search'], action.payload.data)
        setIn(draft, [action.meta.cacheKey, 'loading'], false)
      })

    default:
      return state
  }
}
