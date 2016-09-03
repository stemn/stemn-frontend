import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';

import system from './system';
import header from './header';
import changes from './changes';
import auth from './auth';
import sidebar from './sidebar';
import sidebarTimeline from './sidebarTimeline';
import settings from './settings';
import project from './project';
import projectSettings from './projectSettings';
import projects from './projects';
import files from './files';
import users from './users';
import menubarLayout from './menubarLayout';
import {reducer as toastrReducer} from 'react-redux-toastr'

import userSearch from '../../renderer/main/modules/UserSearch/UserSearch.reducer.js';
import fileList from '../../renderer/main/modules/FileList/FileList.reducer.js';
import fileSelect from '../../renderer/main/modules/FileSelect/FileSelect.reducer.js';
import modals from '../../renderer/main/modules/Modal/Modal.reducer.js';
import upload from '../../renderer/main/modules/Upload/Upload.reducer.js';
import tasks from '../../renderer/main/modules/Tasks/Tasks.reducer.js';
import lists from '../../renderer/main/modules/Tasks/Trello/reducers/lists.js';


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
    lists,
    toastr: toastrReducer
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
