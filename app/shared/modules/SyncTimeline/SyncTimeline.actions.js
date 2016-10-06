export function selectTimelineItem({projectId, selected}) {
  return {
    type:'SELECT_TIMELINE_ITEM',
    payload: {
      projectId,
      selected
    },
    meta: {
      cacheKey: projectId
    }
  }
}

export function fetchTimeline({projectId, fileId}) {
  return {
    type:'TIMELINE/FETCH_TIMELINE',
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/sync/timeline/${projectId}`,
      params: {
        types: ['revisions', 'commits'],
        file: fileId
      },
    },
    meta: {
      cacheKey: fileId ? fileId : projectId
    }
  }
}
