import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import system from './system';
import job from './job';
import project from './project';
import github from './github';
import settings from './settings';
import header from './header';
import changes from './changes';

export default function getRootReducer(scope = 'main') {
  let reducers = {
    system,
    job,
    project,
    github,
    settings,
    header,
    changes,
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
