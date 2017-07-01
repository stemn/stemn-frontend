import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions.js'

export default (store, action) => {
  const { dispatch, getState } = store

  switch (action.type) {
    case 'THREAD/THREAD_UPDATED':
      return dispatch(fetchTimeline({
        entityId: action.payload.threadId,
        size: 500,
        entityType: 'thread',
      }))
  }
}
