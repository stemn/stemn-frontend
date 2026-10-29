import { produce } from 'immer'
import { setIn } from 'stemn-shared/redux/draft'

const initialState = {
  /** *******************************************
This reducer store filter state data
  [cacheKey] : {
    string: 'users:david,jackson some_query',
    object: {
      query: 'some query'
      users: ['david', 'jackson']
      etc etc, any filter keys
    }
  }
******************************************** */
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'STRING_FILTER/SET_FILTER':
      return produce(state, (draft) => {
        setIn(draft, [action.meta.cacheKey], action.payload)
      })

    default:
      return state
  }
}
