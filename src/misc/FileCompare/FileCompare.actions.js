import { getViewerType } from 'stemn-shared/misc/Files/PreviewFile/PreviewFile.utils.js';
import { get } from 'lodash'

export const initCompare = ({ file, cacheKey }) => ({
  type: 'FILE_COMPARE/INIT',
  payload: {
    selected1: get(file, ['revisions', '0'], file),
    selected2: get(file, 'revisions.length', 0) > 1
      ? file.revisions[file.revisions.length - 1]
      : undefined,
    mode: get(file, 'revisions.length', 0) > 1
      ? 'sideBySide'
      : 'single',
  },
  meta: {
    cacheKey,
  },
})

export const select = ({ file, mode, lastSelected, cacheKey }) => ({
  type: 'FILE_COMPARE/SELECT',
  payload: {
    file,
    selectedKey: mode === 'single' || lastSelected === 2
      ? 1
      : 2,
  },
  meta: {
    cacheKey,
  },
})

export const changeMode = ({ mode, cacheKey} ) => {
  return {
    type: 'FILE_COMPARE/CHANGE_MODE',
    payload: {
      mode
    },
    meta: {
      cacheKey
    }
  };
}
