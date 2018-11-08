export const fetchFiles = (
  { projectId, path = '', cacheKey }:
  { projectId: string, path: string, cacheKey: string },
) => {
  return {
    type: 'FILE_LIST/FETCH_FILES',
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/sync/listFolder/${projectId}/${path}`,
    },
    meta: {
      cacheKey,
    },
    throttle: {
      time: 500,
      endpoint: `${projectId}/${path}`,
    },
  }
}

export const exploreFolder = (
  { folderId = '', provider, cacheKey }:
  { folderId: string, provider: string, cacheKey: string },
) => {
  return {
    type: 'FILE_LIST/EXPLORE_FOLDER',
    http: true,
    payload: {
      method: 'GET',
      url: `/api/v1/remote/listFolder/${provider}/${folderId}`,
    },
    meta: {
      cacheKey,
    },
    throttle: {
      time: 500,
      endpoint: `${provider}/${folderId}`,
    },
  }
}

export const getSearchResults = (
  { projectId, folderId, query, cacheKey }:
  { projectId: string, folderId: string, query: string, cacheKey: string },
) => ({
  type: 'FILE_LIST/SEARCH',
  http: true,
  payload: {
    url: `/api/v1/sync/search/${projectId}/${folderId}`,
    params: {
      query,
    },
  },
  meta: {
    cacheKey,
  },
  throttle: {
    time: 500,
    endpoint: `search-${cacheKey}`,
  },
})

export const getFiles = (
  { path, provider, projectId, cacheKey }:
  { path: string, provider: string, projectId: string, cacheKey: string },
) => (dispatch) => {
  if (provider) {
    dispatch(exploreFolder({
      provider,
      folderId: path,
      cacheKey,
    }))
  } else {
    dispatch(fetchFiles({
      projectId,
      path,
      cacheKey,
    }))
  }
}
