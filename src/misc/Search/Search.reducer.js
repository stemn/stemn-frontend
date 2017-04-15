import i from 'icepick'
import querystring from 'querystring'

const initialState = {
  query: querystring.parse(window.location.search.substring(1)).q,
  loading: false,
  data: []
}

export default function (state = initialState, action) {
  switch (action.type) {

    case 'SEARCH/SET_QUERY': {
      return i.assoc(state, 'query', action.payload)
    }
    case 'SEARCH/SEARCH_PENDING': {
      return i.assoc(state, 'loading', true)
    }
    case 'SEARCH/SEARCH_REJECTED': {
      return i.assoc(state, 'loading', true)
    }
    case 'SEARCH/SEARCH_FULFILLED': {
      return i.chain(state)
        .assoc('loading', false)
        .assoc('data', action.payload.data)
        .value()
    }

    default:
      return state
  }
}
