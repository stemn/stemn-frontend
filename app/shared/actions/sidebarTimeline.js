export function selectTimelineItem({projectId, selected}) {
  return {
    type:'SELECT_TIMELINE_ITEM',
    payload: {
      projectId,
      selected
    }
  }
}


export function fetchTimeline({stub}) {
  return {
    type:'TIMELINE/FETCH_TIMELINE',
    http: true,
    payload: {
      method: 'GET',
      url: `http://localhost:3000/api/v1/sync/timeline/${stub}`,
      params: {
        type: 'all'
      },
      meta: {
        stub
      }
    }
  }
}
