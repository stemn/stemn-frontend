import i from 'icepick'
import querystring from 'querystring'

const initialState = {
  query: querystring.parse(window.location.search.substring(1)).q,
  data: {
    /********************************
    [cacheLey] : {
      loading: false,
      data: []
    }
    ********************************/
  }
}

export default function (state = initialState, action) {
  switch (action.type) {

    case 'SEARCH/SET_QUERY': {
      return i.assoc(state, 'query', action.payload)
    }
    case 'SEARCH/SEARCH_PENDING': {
      return i.assocIn(state, ['data', action.meta.cacheKey, 'loading'], true)
    }
    case 'SEARCH/SEARCH_REJECTED': {
      return i.assocIn(state, ['data', action.meta.cacheKey, 'loading'], true)
    }
    case 'SEARCH/SEARCH_FULFILLED': {
      return i.chain(state)
        .assocIn(['data', action.meta.cacheKey, 'loading'], false)
        .assocIn(['data', action.meta.cacheKey, 'data'], action.payload.data)
        .value()
    }

    default:
      return state
  }
}
