import i from 'icepick'

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
      return i.assoc(state, action.meta.cacheKey, action.payload)

    default:
      return state
  }
}
