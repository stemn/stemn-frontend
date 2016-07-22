import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';

import system from './system';
import header from './header';
import changes from './changes';
import auth from './auth';
import login from './login';
import sidebar from './sidebar';

export default function getRootReducer(scope = 'main') {
  let reducers = {
    system,
    header,
    changes,
    auth,
    login,
    sidebar,
  };

  if (scope === 'renderer') {
    reducers = {
      ...reducers,
      routing,
      form,
    };
  }

  return combineReducers({ ...reducers });
}
