import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import system from './system';
import header from './header';
import auth from './auth';
import sidebar from './sidebar';
import sidebarTimeline from './sidebarTimeline';
import settings from './settings';
import project from './project';
import projectSettings from './projectSettings';
import projects from './projects';
import users from './users';
import menubarLayout from './menubarLayout';

import userSearch   from '../../renderer/main/modules/UserSearch/UserSearch.reducer.js';
import fileList     from '../../renderer/main/modules/FileList/FileList.reducer.js';
import fileSelect   from '../../renderer/main/modules/FileSelect/FileSelect.reducer.js';
import modals       from '../../renderer/main/modules/Modal/Modal.reducer.js';
import upload       from '../../renderer/main/modules/Upload/Upload.reducer.js';
import tasks        from '../../renderer/main/modules/Tasks/Tasks.reducer.js';
import comments     from '../../renderer/main/modules/Comments/Comments.reducer.js';
import toasts       from '../../renderer/main/modules/Toasts/Toasts.reducer.js';
import fileCompare  from '../../renderer/main/modules/FileCompare/FileCompare.reducer.js';
import changes      from '../../renderer/main/modules/Changes/Changes.reducer.js';
import mentions     from '../../renderer/main/modules/Mentions/Mentions.reducer.js';
import files        from '../../renderer/main/modules/Files/Files.reducer.js';

export default function getRootReducer(scope = 'main') {
  let reducers = {
    system,
    header,
    changes,
    auth,
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
    fileSelect,
    modals,
    users,
    upload,
    tasks,
    comments,
    toasts,
    fileCompare,
    mentions
  };

  if (scope === 'renderer') {
    reducers = {
      ...reducers,
      routing,
    };
  }

  return combineReducers({ ...reducers });
}
