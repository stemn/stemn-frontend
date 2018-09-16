import * as i from 'icepick'
import { AnyAction } from 'redux'
import { IFileCompareMode } from 'stemn-shared/misc/FileCompare/types'
import { IFile } from 'stemn-shared/misc/FileList/types'

export interface IFileCompareState {
  [cacheKey: string]: {
    editActive: boolean,
    mode: IFileCompareMode,
    selected1: IFile,
    selected2?: IFile,
    lastSelected: number,
  }
}

const initialState: IFileCompareState = {}

export const fileCompareReducer = (state: IFileCompareState = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'FILE_COMPARE/INIT':
      return i.assoc(state, action.meta.cacheKey, {
        edit: false,
        mode: action.payload.mode,
        selected1: action.payload.selected1,
        selected2: action.payload.selected2,
        lastSelected: 1,
      })
    case 'FILE_COMPARE/SELECT':
      return i.chain(state)
        .assocIn([action.meta.cacheKey, `selected${action.payload.selectedKey}`], action.payload.file)
        .assocIn([action.meta.cacheKey, 'lastSelected'], action.payload.selectedKey)
        .value()

    case 'FILE_COMPARE/CHANGE_MODE':
      return i.merge(state, {
        [action.meta.cacheKey]: {
          mode: action.payload.mode,
        },
      })

    case 'FILE_COMPARE/EDIT_TOGGLE':
      return i.updateIn(state, [action.meta.cacheKey, 'editActive'], (status) => !status)

    default:
      return state
  }
}
