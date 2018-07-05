import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'
import { getComment } from 'stemn-shared/misc/Comments/Comments.actions'
import { getThread } from 'stemn-shared/misc/Threads/Threads.actions'

export default (store, action) => {
  const {
    dispatch,
  } = store

  switch (action.type) {
    case 'THREAD/THREAD_UPDATED': {
      dispatch(fetchTimeline({
        entityId: action.payload.threadId,
        size: 500,
        entityType: 'thread',
      }))
      dispatch(getThread({
        threadId: action.payload.threadId,
      }))
    }
    case 'THREAD/COMMENT_UPDATED':
      return dispatch(getComment({
        commentId: action.payload.comment,
      }))
  }
}
