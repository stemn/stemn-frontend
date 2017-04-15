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

export function fetchTimeline({ projectId, fileId, provider }) {
  const getTypes = () => {
    if(fileId){
      if(projectId){
        return ['commits', 'changes']
      }
      else{
        return ['revisions']
      }
    }
    else{
      return ['commits']
    }
  }
  return {
    type:'TIMELINE/FETCH_TIMELINE',
    payload: http({
      method: 'GET',
      url: projectId 
      ? `/api/v1/sync/timeline/${projectId}` 
      : `/api/v1/remote/timeline/${provider}`,
      params: {
        types: getTypes(),
        file: fileId
      },
    }),
    meta: {
      cacheKey: fileId ? fileId : projectId
    }
  }
}

export const getFeed = () => ({
  // This will get the feed for all items the current user is interested in
  type:'TIMELINE/FETCH_TIMELINE',
  payload: http({
    method: 'GET',
    url: `/api/v1/feed/sync`,
    params: {
      types: ['changes', 'commits']
    },
  }),
  meta: {
    cacheKey: 'feed'
  }
})
