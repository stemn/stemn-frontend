import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';

import system from './system';
import header from './header';
import changes from './changes';
import auth from './auth';
import login from './login';
import sidebar from './sidebar';
import sidebarTimeline from './sidebarTimeline';
import settings from './settings';
import project from './project';
import projectSettings from './projectSettings';
import projects from './projects';
import files from './files';
import menubarLayout from './menubarLayout';

import userSearch from '../../renderer/main/modules/UserSearch/UserSearch.reducer.js';
import fileList from '../../renderer/main/modules/FileList/FileList.reducer.js';
import fileSelect from '../../renderer/main/modules/fileSelect/fileSelect.reducer.js';

export default function getRootReducer(scope = 'main') {
  let reducers = {
    system,
    header,
    changes,
    auth,
    login,
    sidebar,
    sidebarTimeline,
    settings,
    project,
    projectSettings,
    projects,
    files,
    menubarLayout,
    userSearch,
    fileList,
    fileSelect
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
