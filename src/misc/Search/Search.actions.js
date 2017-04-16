import { replace } from 'react-router-redux'

export const search = ({ entityType, value, size = 20, page = 1, parentType, parentId }) => ({
  type: 'SEARCH/SEARCH',
  http: true,
  payload: {
    url: `/api/v1/search`,
    method: 'GET',
    params: {
      type: entityType,
      key: 'name',
      value: value,
      size,
      page,
      parentType,
      parentId,
      match: 'regex'
    },
  },
  throttle: {
    time: 500,
    endpoint: 'SEARCH/SEARCH'
  },
})

export const setQuery = ({ value }) => (dispatch, getState) => {
  dispatch({
    type: 'SEARCH/SET_QUERY',
    payload: value
  })
  const currentLocation = getState().routing.locationBeforeTransitions;
  if (currentLocation.pathname === '/search') {
    dispatch(replace({
      pathname: '/search',
      query: {
        q: value,
        type: currentLocation.query.type,
        page: 1,
      }
    }))
  }
}
