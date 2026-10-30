import http from 'axios'
import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions'
import { getThread } from 'stemn-shared/misc/Threads/Threads.actions'
import { queryKeys } from 'stemn-shared/api/query/keys'
import { invalidateQueries } from 'stemn-shared/api/query/invalidation'
import { refresh } from './refresh'

/**
 * The API serves timelines stale-while-revalidate (stemn-backend cache/caches/timeline.ts): every fetch
 * answers with the timeline computed at the previous fetch and recomputes it in the background (its
 * HISTORY/HISTORY_UPDATED event is not routed by the websocket server). So after a change the timeline
 * is requested once to start the recomputation (the stale answer is ignored: storing it would remove
 * the event the app has just added, e.g. our new comment) and fetched into Redux once it is done.
 */
export const TIMELINE_REVALIDATION_DELAY = 1500

const timelineParams = (threadId) => ({ entityId: threadId, size: 500, entityType: 'thread' })

const revalidateTimeline = (dispatch, threadId) => {
  http({ method: 'GET', url: '/api/v1/timeline', params: timelineParams(threadId) }).catch(() => undefined)
  setTimeout(() => dispatch(fetchTimeline(timelineParams(threadId))), TIMELINE_REVALIDATION_DELAY)
}

export default (store, action) => {
  const { dispatch, getState } = store

  switch (action.type) {
    case 'THREAD/THREAD_UPDATED': {
      const { threadId } = action.payload
      // The timeline is still Redux
      revalidateTimeline(dispatch, threadId)
      // The thread (name, status, numComments...) and the lists it appears in
      dispatch(invalidateQueries(queryKeys.threads.lists()))
      return refresh(store, [queryKeys.threads.detail(threadId)], () => {
        // Redux readers (the board, the thread modal) only hold the threads they loaded
        if (getState().threads.data[threadId]) dispatch(getThread({ threadId }))
      })
    }
    case 'THREAD/COMMENT_UPDATED':
      return refresh(store, [queryKeys.comments.detail(action.payload.comment)])
  }
}
