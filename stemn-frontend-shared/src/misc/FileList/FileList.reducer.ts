import * as i from 'icepick'
import { AnyAction } from 'redux'
// import * as actions from './FileList.actions'
import { IFile, IFolder } from './types'

export interface IFileListState {
  [cacheKey: string]: {
    /** Array of entries */
    entries: IFile[],
    /** Info about the folder we are searching */
    folder: IFolder,
    /** Search query */
    query: string,
  }
}

const initialState: IFileListState = {}

export const fileListReducer = (state: IFileListState = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'FILE_LIST/FETCH_FILES_PENDING':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    case 'FILE_LIST/FETCH_FILES_REJECTED':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    case 'FILE_LIST/FETCH_FILES_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, 'entries'], action.payload.data.entries)
        .assocIn([action.meta.cacheKey, 'folder'], action.payload.data.folder)
        .assocIn([action.meta.cacheKey, 'loading'], false)
        .value()

    case 'FILE_LIST/EXPLORE_FOLDER_PENDING':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    case 'FILE_LIST/EXPLORE_FOLDER_REJECTED':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    case 'FILE_LIST/EXPLORE_FOLDER_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, 'entries'], action.payload.data.entries)
        .assocIn([action.meta.cacheKey, 'folder'], action.payload.data.folder)
        .assocIn([action.meta.cacheKey, 'loading'], false)
        .value()

    case 'FILE_LIST/SEARCH_PENDING':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], true)
    case 'FILE_LIST/SEARCH_REJECTED':
      return i.assocIn(state, [action.meta.cacheKey, 'loading'], false)
    case 'FILE_LIST/SEARCH_FULFILLED':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, 'search'], action.payload.data)
        .assocIn([action.meta.cacheKey, 'loading'], false)
        .value()

    default:
      return state
  }
}
