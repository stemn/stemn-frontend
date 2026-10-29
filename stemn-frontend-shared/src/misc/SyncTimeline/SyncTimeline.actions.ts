import http from 'axios'
import getUuid from 'stemn-shared/utils/getUuid.js'

/** The entities that have a timeline */
export type TimelineEntityType = 'project' | 'file' | 'thread' | 'user' | 'board'

export interface ITimelineQuery {
  entityType: TimelineEntityType
  entityId: string
  /** Event types, e.g. ['commits', 'changes'] */
  types?: string[]
  /** Defaults to the entity id */
  cacheKey?: string
  page?: number
  size?: number
  criteria?: Record<string, unknown>
}

export const deselect = ({ projectId }: { projectId: string }) => {
  return {
    type: 'TIMELINE/DESELECT_ITEM',
    payload: {
      projectId,
    },
    meta: {
      cacheKey: projectId,
    },
  }
}

export const selectTimelineItem = ({ projectId, selected }: { projectId: string; selected: unknown }) => {
  return {
    type: 'TIMELINE/SELECT_ITEM',
    payload: {
      projectId,
      selected,
    },
    meta: {
      cacheKey: projectId,
    },
  }
}

// `provider` is accepted but unused (the remote timeline endpoint is not used any more)
export const fetchTimeline = ({
  entityType,
  entityId,
  provider,
  types,
  cacheKey,
  page,
  size,
  criteria,
}: ITimelineQuery & { provider?: string }) => {
  //  `/api/v1/remote/timeline/${provider}`
  return {
    type: 'TIMELINE/FETCH_TIMELINE',
    payload: http({
      method: 'GET',
      url: '/api/v1/timeline',
      params: {
        entityType,
        entityId,
        types,
        page,
        size,
        criteria,
      },
    }),
    meta: {
      cacheKey: cacheKey || entityId,
    },
    throttle: {
      time: 500,
      endpoint: `fetch-timeline/${entityType}`,
    },
  }
}

export const getCount = ({
  entityType,
  entityId,
  types,
  cacheKey,
}: Pick<ITimelineQuery, 'entityType' | 'entityId' | 'types'> & { cacheKey: string }) => {
  return {
    type: 'TIMELINE/FETCH_TIMELINE',
    payload: http({
      method: 'GET',
      url: '/api/v1/timeline',
      params: {
        entityType,
        entityId,
        types,
        count: true,
      },
    }),
    meta: {
      cacheKey,
    },
  }
}

export const addEvent = ({ cacheKey, event }: { cacheKey: string; event: object }) => {
  const eventObject = {
    ...event,
    _id: getUuid(),
  }
  return {
    type: 'TIMELINE/ADD_EVENT',
    payload: {
      event: eventObject,
      cacheKey,
    },
  }
}

export const deleteEvent = ({ cacheKey, eventId }: { cacheKey: string; eventId: string }) => ({
  type: 'TIMELINE/DELETE_EVENT',
  payload: {
    cacheKey,
    eventId,
  },
})

export const getFeed = ({
  feedType,
  page,
  size,
  cacheKey,
}: {
  feedType: 'followed-users' | 'followed-projects' | 'followed-all'
  page?: number
  size?: number
  cacheKey: string
}) => ({
  // This will get the feed for all items the current user is interested in
  type: 'TIMELINE/FETCH_TIMELINE',
  payload: http({
    method: 'GET',
    url: '/api/v1/feed',
    params: {
      size,
      page,
      types: ['commits', 'threads', 'threadEvents', 'changes'],
      feedType, // followed-users, followed-projects, followed-all
    },
  }),
  meta: {
    cacheKey,
  },
})
