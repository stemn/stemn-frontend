import { emitDiffEvent } from 'stemn-shared/misc/FileDiff/diff.events'

// a pending diff finished (stemn-backend core.diff.diffSafely): the open diff view asks for the manifest again
export default (store, action) => {
  switch (action.type) {
    case 'DIFF/DIFF_COMPLETE':
      return emitDiffEvent({ type: 'complete', payload: action.payload })
    case 'DIFF/DIFF_FAILED':
      return emitDiffEvent({ type: 'failed', payload: action.payload })
  }
}
