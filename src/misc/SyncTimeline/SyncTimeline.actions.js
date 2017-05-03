import http from 'axios';

export function deselect({ projectId }) {
  return {
    type:'TIMELINE/DESELECT_ITEM',
    payload: {
      projectId,
    },
    meta: {
      cacheKey: projectId
    }
  }
}

export function selectTimelineItem({ projectId, selected }) {
  return {
    type:'TIMELINE/SELECT_ITEM',
    payload: {
      projectId,
      selected
    },
    meta: {
      cacheKey: projectId
    }
  }
}

export function fetchTimeline({ entityType, entityId, provider, types, cacheKey, page, size }) {
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
//        criteria: {
//          summary: '/commit/i',
//        },
      },
    }),
    meta: {
      cacheKey: cacheKey || entityId,
    },
  }
}

export const getFeed = ({ feedType = 'followed-projects' } = {}) => ({
  // This will get the feed for all items the current user is interested in
  type: 'TIMELINE/FETCH_TIMELINE',
  payload: http({
    method: 'GET',
    url: '/api/v1/feed',
    params: {
      types: ['commits'],
      feedType, // followed-users, followed-projects, followed-all
    },
  }),
  meta: {
    cacheKey: feedType,
  },
})
