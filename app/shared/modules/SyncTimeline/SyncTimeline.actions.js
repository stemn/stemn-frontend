export function deselect({projectId}) {
  return {
    type:'TIMELINE/DESELECT_ITEM',
    payload: {
      projectId,
    },
  }
}

export function selectTimelineItem({projectId, selected}) {
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

export function fetchTimeline({projectId, fileId}) {
  return {
    type:'TIMELINE/FETCH_TIMELINE',
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/sync/timeline/${projectId}`,
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
