import { fetchTimeline } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.actions'
import type { SocketEventHandler } from './types'

const filesEvents: SocketEventHandler = (store, action) => {
  const { dispatch } = store

  switch (action.type) {
    case 'FILES/FILES_UPDATED':
      return action.payload.files.map((fileId) =>
        dispatch(
          fetchTimeline({
            entityType: 'project',
            provider: action.payload.provider,
            entityId: fileId,
          }),
        ),
      )
  }
}

export default filesEvents
