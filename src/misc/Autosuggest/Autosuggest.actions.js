import http from 'axios'


export const loadSuggestions = cacheKey => ({ entityType, value }) => {
  if (entityType === 'location') {
    return {
      type: 'AUTO_SUGGEST/GET_SUGGESTIONS',
      payload: http({
        url: 'https://maps.googleapis.com/maps/api/geocode/json',
        method: 'GET',
        params: {
          address: value,
          sensor: false,
        },
        headers: {
          Authorization: null,
        },
      }).then(response => ({
        data: response.data.results.map(item => ({
          name: item.formatted_address,
          geo: item.geometry.location,
          components: item.address_components,
        })),
      })),
      meta: {
        cacheKey,
      },
    }
  } 
  return {
    type: 'AUTO_SUGGEST/GET_SUGGESTIONS',
    http: true,
    payload: {
      url: '/api/v1/search',
      method: 'GET',
      params: {
        type: entityType,
        criteria: {
          name: value && `/${value}/i`,
        },
        size: 10,
        match: 'regex',
      },
    },
    throttle: {
      time: 500,
      endpoint: `autosuggest-${entityType}`,
    },
    meta: {
      cacheKey,
    },
  }
}

export const updateInputValue = cacheKey => value => ({
  type: 'AUTO_SUGGEST/UPDATE_INPUT',
  payload: {
    value,
  },
  meta: {
    cacheKey,
  },
})

export const clearSuggestions = cacheKey => () => ({
  type: 'AUTO_SUGGEST/CLEAR_SUGGESTIONS',
  meta: {
    cacheKey,
  },
})
