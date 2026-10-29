import { produce } from 'immer'
import { get } from 'lodash'
import { AnyAction } from 'redux'
import { IFileCompareMode } from 'stemn-shared/misc/FileCompare/types'
import { IFile } from 'stemn-shared/misc/FileList/types'
import { mergeDeep, setIn } from 'stemn-shared/redux/draft'

export interface IFileCompareItem {
  editActive: boolean
  mode: IFileCompareMode
  selected1: IFile
  selected2?: IFile
  lastSelected: number
}

export interface IFileCompareState {
  [cacheKey: string]: IFileCompareItem
}

const initialState: IFileCompareState = {}

export const fileCompareReducer = (state: IFileCompareState = initialState, action: AnyAction) => {
  switch (action.type) {
    case 'FILE_COMPARE/INIT':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey], {
          edit: false,
          mode: action.payload.mode,
          selected1: action.payload.selected1,
          selected2: action.payload.selected2,
          lastSelected: 1,
        })
      })
    case 'FILE_COMPARE/SELECT':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, `selected${action.payload.selectedKey}`], action.payload.file)
        setIn(draft, [action.meta.cacheKey, 'lastSelected'], action.payload.selectedKey)
      })

    case 'FILE_COMPARE/CHANGE_MODE':
      return produce(state, (draft) => {
        mergeDeep(draft, {
          [action.meta.cacheKey]: {
            mode: action.payload.mode,
          },
        })
      })

    case 'FILE_COMPARE/EDIT_TOGGLE':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey, 'editActive'], !get(state, [action.meta.cacheKey, 'editActive']))
      })

    default:
      return state
  }
}
