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

export const changeMode = ({ mode, cacheKey }) => 
  //    let { selected1, selected2 } = this.state;
//    // If a second file is not selected - we select one if possible
//    if(!selected2){
//      const revisionIndex = revisions.findIndex(revision => revision.data.fileId === selected1.data.fileId && revision.data.revisionId === selected1.data.revisionId);
//      if(revisions[revisionIndex - 1]){selected2 = revisions[revisionIndex - 1];}
//      else if(revisions[revisionIndex + 1]){selected2 = revisions[revisionIndex + 1];}
//    }
//    this.setState({mode, selected2})
  ({
    type: 'FILE_COMPARE/CHANGE_MODE',
    payload: {
      mode,
    },
    meta: {
      cacheKey,
    },
  })

