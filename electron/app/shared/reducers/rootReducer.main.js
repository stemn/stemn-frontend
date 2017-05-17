import { combineReducers } from 'redux';
import rootReducer from './rootReducer.base.js'
import formReducer from 'stemn-shared/misc/Forms/Form.reducer.js'

export default function getRootReducer() {
  const reducers = {
    ...rootReducer,
  };
  const appReducer = combineReducers({ ...reducers});
  return (state, action) => {
    if (action.type === 'STATE/CLEAR') {
      state = undefined
    }
    const stateAfterForm = formReducer(state, action)
    return appReducer(stateAfterForm, action)
  }
}
