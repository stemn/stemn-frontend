import { getBoard, getGroup, getTask } from 'stemn-shared/misc/Tasks/Tasks.actions.js'
import { getComment } from 'stemn-shared/misc/Comments/Comments.actions.js'

export default (store, action) => {
  const { dispatch, getState } = store

  if (action.payload.actioner === getState().auth.user._id){
    return undefined
  }

  // Actions that we DON'T process if user is the actioner
  switch (action.type) {
    case 'BOARD/BOARD_UPDATED':
      return dispatch(getBoard({ boardId : action.payload.boardId }))
    case 'BOARD/GROUPS_UPDATED':
      return action.payload.groups.map((groupId) => dispatch(getGroup({ groupId, boardId : action.payload.boardId })))
    case 'BOARD/TASKS_UPDATED':
      return action.payload.tasks.map((taskId) => dispatch(getTask({ taskId })))
    case 'BOARD/TASK_COMPLETED_UPDATED':
      return dispatch(getTask({ taskId : action.payload.taskId }))
    case 'BOARD/COMMENTS_UPDATED':
      return action.payload.comments.map((commentId) => dispatch(getComment({ commentId })))
  }
}
