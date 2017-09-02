import { createFilterString, parseFilterString } from 'stemn-shared/misc/StringFilter/StringFilter.utils'
import { push, replace } from 'react-router-redux'

export const setFilter = ({ cacheKey, location, filterString, filterModel, filterObject }) => (dispatch, getState) => {
  const string = filterString || createFilterString(filterObject, filterModel)
  const object = filterObject || parseFilterString(filterString, filterModel)
  dispatch({
    type: 'STRING_FILTER/SET_FILTER',
    payload: {
      string,
      object,
    },
    meta: {
      cacheKey,
    },
  })

  const pathname = getState().routing.locationBeforeTransitions.pathname
  if (location === 'push') {
    dispatch(replace({
      pathname,
      query: object,
    }))
  } else if (location === 'replace') {
    dispatch(push({
      pathname,
      query: object,
    }))
  }
}
