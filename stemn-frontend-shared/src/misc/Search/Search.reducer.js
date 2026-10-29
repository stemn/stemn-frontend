import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'
import { parseQuery } from 'stemn-shared/routing/query'

const initialState = {
  query: typeof window !== 'undefined' ? parseQuery(window.location.search).q : '', // If this is used in electron, window.location will not exist.
  data: {
    /** ******************************
    [cacheLey] : {
      loading: false,
      data: []
    }
    ******************************* */
  },
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SEARCH/SET_QUERY': {
      return produce(state, (draft) => {
        draft.query = action.payload
      })
    }
    case 'SEARCH/SEARCH_PENDING': {
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.cacheKey, 'loading'], true)
      })
    }
    case 'SEARCH/SEARCH_REJECTED': {
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.cacheKey, 'loading'], true)
      })
    }
    case 'SEARCH/SEARCH_FULFILLED': {
      return produce(state, (draft) => {
        setIn(draft, ['data', action.meta.cacheKey, 'loading'], false)
        setIn(draft, ['data', action.meta.cacheKey, 'data'], action.payload.data)
      })
    }

    default:
      return state
  }
}
