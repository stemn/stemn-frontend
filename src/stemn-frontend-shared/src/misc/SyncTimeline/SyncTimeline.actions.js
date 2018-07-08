import http from 'axios'
import getUuid from 'stemn-shared/utils/getUuid.js'

export function deselect({ projectId }) {
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

export function selectTimelineItem({ projectId, selected }) {
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

export function fetchTimeline({ entityType, entityId, provider, types, cacheKey, page, size, criteria }) {
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

export function getCount({ entityType, entityId, types, cacheKey }) {
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

export const addEvent = ({ cacheKey, event }) => {
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

export const deleteEvent = ({ cacheKey, eventId }) => ({
  type: 'TIMELINE/DELETE_EVENT',
  payload: {
    cacheKey,
    eventId,
  },
})


export const getFeed = ({ feedType, page, size, cacheKey }) => ({
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
