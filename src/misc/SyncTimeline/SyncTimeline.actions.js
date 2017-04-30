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

export function fetchTimeline({ entityType, entityId, provider }) {
//  `/api/v1/remote/timeline/${provider}`
  const getTypes = () => {
    if (entityType === 'file') {
      return ['commits', 'changes']
    } else {
      return ['commits']
    }
  }
  return {
    type:'TIMELINE/FETCH_TIMELINE',
    payload: http({
      method: 'GET',
      url: '/api/v1/timeline',
      params: {
        entityType,
        entityId,
        types: getTypes(),
      },
    }),
    meta: {
      cacheKey: entityId,
    }
  }
}

export const getFeed = () => ({
  // This will get the feed for all items the current user is interested in
  type: 'TIMELINE/FETCH_TIMELINE',
  payload: http({
    method: 'GET',
    url: '/api/v1/feed',
    params: {
      types: ['commits'],
    },
  }),
  meta: {
    cacheKey: 'feed',
  },
})
