import http from 'axios';


export const loadSuggestions = (cacheKey) => ({ entityType, value }) => {
  return {
    type:'AUTO_SUGGEST/GET_SUGGESTIONS',
    payload: http({
      url: `/api/v1/search`,
      method: 'GET',
      params: {
        type: entityType,
        key: 'name',
        value: value,
        size: 10,
        match: 'regex'
      },
    }),
    meta: {
      cacheKey
    }
  }
}

export const updateInputValue = (cacheKey) => (value) => {
  return {
    type: 'AUTO_SUGGEST/UPDATE_INPUT',
    payload: {
      value
    },
    meta: {
      cacheKey
    }
  };
}

export const clearSuggestions = (cacheKey) => () => {
  return {
    type: 'AUTO_SUGGEST/CLEAR_SUGGESTIONS',
    meta: {
      cacheKey
    }
  };
}
