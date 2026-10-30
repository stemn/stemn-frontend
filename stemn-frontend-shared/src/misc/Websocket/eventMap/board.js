import { getBoard, getGroup, getThread } from 'stemn-shared/misc/Threads/Threads.actions.js'
import { queryKeys } from 'stemn-shared/api/query/keys'
import { invalidateQueries } from 'stemn-shared/api/query/invalidation'
import { refresh } from './refresh'

export default (store, action) => {
  const { dispatch, getState } = store

  if (action.payload.actioner === getState().auth.user._id) {
    return undefined
  }

  // Actions that we DON'T process if user is the actioner
  switch (action.type) {
    case 'BOARD/BOARD_UPDATED':
      return dispatch(getBoard({ boardId: action.payload.boardId }))
    case 'BOARD/GROUPS_UPDATED': {
      // A thread was created, moved or deleted: the thread lists of the board's project are stale
      const board = getState().threads.boards[action.payload.boardId]
      const projectId = board && board.data && board.data.project
      dispatch(invalidateQueries(projectId ? queryKeys.threads.projectLists(projectId) : queryKeys.threads.lists()))
      if (!board || !board.data) return undefined
      return action.payload.groups.map((groupId) => dispatch(getGroup({ groupId, boardId: action.payload.boardId })))
    }
    case 'BOARD/THREADS_UPDATED':
      return action.payload.threads.map((threadId) =>
        refresh(store, [queryKeys.threads.detail(threadId)], () => dispatch(getThread({ threadId }))),
      )
    case 'BOARD/TASK_COMPLETED_UPDATED':
      return refresh(store, [queryKeys.threads.detail(action.payload.threadId)], () =>
        dispatch(getThread({ threadId: action.payload.threadId })),
      )
    case 'BOARD/COMMENTS_UPDATED':
      return dispatch(
        invalidateQueries(...action.payload.comments.map((commentId) => queryKeys.comments.detail(commentId))),
      )
  }
}
