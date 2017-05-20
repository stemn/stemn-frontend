import { combineReducers } from 'redux'
import rootReducer from './rootReducer.base.js'
import storeReducer from 'stemn-shared/misc/Store/Store.reducer.js'

export default function getRootReducer() {
  const reducers = {
    ...rootReducer,
  }

  const splitReducers = combineReducers({ ...reducers})
  return (state, action) => {
    const isStoreAction = action && action.type && action.type.startsWith('STORE/')
    return isStoreAction
      ? storeReducer(state, action)
      : splitReducers(state, action)
  }
}
