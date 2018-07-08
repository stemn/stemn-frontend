import { getBoard, getGroup, getThread } from 'stemn-shared/misc/Threads/Threads.actions.js'
import { getComment } from 'stemn-shared/misc/Comments/Comments.actions.js'

export default (store, action) => {
  const { dispatch, getState } = store

  if (action.payload.actioner === getState().auth.user._id) {
    return undefined
  }

  // Actions that we DON'T process if user is the actioner
  switch (action.type) {
    case 'BOARD/BOARD_UPDATED':
      return dispatch(getBoard({ boardId: action.payload.boardId }))
    case 'BOARD/GROUPS_UPDATED':
      return action.payload.groups.map(groupId => dispatch(getGroup({ groupId, boardId: action.payload.boardId })))
    case 'BOARD/THREADS_UPDATED':
      return action.payload.threads.map(threadId => dispatch(getThread({ threadId })))
    case 'BOARD/TASK_COMPLETED_UPDATED':
      return dispatch(getThread({ threadId: action.payload.threadId }))
    case 'BOARD/COMMENTS_UPDATED':
      return action.payload.comments.map(commentId => dispatch(getComment({ commentId })))
  }
}
