import { combineReducers } from 'redux';
import rootReducer from './rootReducer.base.js'

export default function getRootReducer() {
  const reducers = {
    ...rootReducer,
  };

  const appReducer = combineReducers({ ...reducers});
  return (state, action) => {
    if (action.type === 'STATE/CLEAR') {
      state = undefined
    }
    return appReducer(state, action)
  }
}
