import http from 'axios';

export function selectTimelineItem(item) {
  return {
      type:'SELECT_TIMELINE_ITEM',
      payload: item
  }
}


export function fetchTimeline({stub}) {
  return {
      type:'TIMELINE/FETCH_TIMELINE',
      payload: http({
        method: 'GET',
        url: `http://localhost:3000/api/v1/sync/timeline/${stub}`,
        params: {
          type: 'all'
        },
        meta: {
          stub
        }
      })
  }
}
