import { replace } from 'react-router-redux'

export const search = ({ entityType, value, size, page, parentType, parentId, criteria, select, sort, cacheKey }) => ({
  type: 'SEARCH/SEARCH',
  http: true,
  payload: {
    url: '/api/v1/search',
    method: 'GET',
    params: {
      type: entityType,
      key: 'name',
      value,
      size,
      page,
      parentType,
      parentId,
      match: 'regex',
      criteria,
      select,
      sort,
    },
  },
  meta: {
    cacheKey: cacheKey || `${entityType}-${value}-${page}-${parentType}-${parentId}`,
  },
  throttle: {
    time: 500,
    endpoint: `SEARCH/${entityType}`,
  },
})

export const setQuery = ({ value }) => (dispatch, getState) => {
  dispatch({
    type: 'SEARCH/SET_QUERY',
    payload: value,
  })
  const currentLocation = getState().routing.locationBeforeTransitions
  if (currentLocation.pathname === '/search') {
    dispatch(replace({
      pathname: '/search',
      query: {
        q: value,
        type: currentLocation.query.type,
        page: 1,
      },
    }))
  }
}
