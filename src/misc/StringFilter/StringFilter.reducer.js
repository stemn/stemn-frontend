import i from 'icepick'
import { modeled } from 'react-redux-form'

const initialState = {
/*********************************************
This reducer store filter state data
  [cacheKey] : {
    string: 'users:david,jackson some_query',
    object: {
      query: 'some query'
      users: ['david', 'jackson']
      etc etc, any filter keys
    }
  }
*********************************************/
}

const mainReducer = (state, action) => {
  switch (action.type) {
    case 'STRING_FILTER/SET_FILTER':
      return i.assoc(state, action.meta.cacheKey, action.payload)

    default:
      return state
  }
}

export default (state = initialState, action = {}) => {
  return modeled(mainReducer, 'stringFilter')(state, action)
}
