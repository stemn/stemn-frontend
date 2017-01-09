import { combineReducers } from 'redux';

import auth             from 'stemn-frontend-shared/src/redux/reducers/auth';
import header           from 'stemn-frontend-shared/src/redux/reducers/header';
import menubarLayout    from 'stemn-frontend-shared/src/redux/reducers/menubarLayout';
import projectSettings  from 'stemn-frontend-shared/src/redux/reducers/projectSettings';
import projects         from 'stemn-frontend-shared/src/redux/reducers/projects';
import sidebar          from 'stemn-frontend-shared/src/redux/reducers/sidebar';
import users            from 'stemn-frontend-shared/src/redux/reducers/users';

import changes          from 'stemn-frontend-shared/src/misc/Changes/Changes.reducer.js';
import comments         from 'stemn-frontend-shared/src/misc/Comments/Comments.reducer.js';
import fileCompare      from 'stemn-frontend-shared/src/misc/FileCompare/FileCompare.reducer.js';
import fileList         from 'stemn-frontend-shared/src/misc/FileList/FileList.reducer.js';
import fileSelect       from 'stemn-frontend-shared/src/misc/FileSelect/FileSelect.reducer.js';
import files            from 'stemn-frontend-shared/src/misc/Files/Files.reducer.js';
import mentions         from 'stemn-frontend-shared/src/misc/Mentions/Mentions.reducer.js';
import modals           from 'stemn-frontend-shared/src/misc/Modal/Modal.reducer.js';
import syncTimeline     from 'stemn-frontend-shared/src/misc/SyncTimeline/SyncTimeline.reducer.js';
import tasks            from 'stemn-frontend-shared/src/misc/Tasks/Tasks.reducer.js';
import toasts           from 'stemn-frontend-shared/src/misc/Toasts/Toasts.reducer.js';
import togglePanel      from 'stemn-frontend-shared/src/misc/TogglePanel/TogglePanel.reducer.js';
import upload           from 'stemn-frontend-shared/src/misc/Upload/Upload.reducer.js';
import userSearch       from 'stemn-frontend-shared/src/misc/UserSearch/UserSearch.reducer.js';
import walkthrough      from 'stemn-frontend-shared/src/misc/Walkthrough/Walkthrough.reducer.js';

export default combineReducers({
  auth,
  changes,
  comments,
  fileCompare,
  fileList,
  fileSelect,
  files,
  header,
  mentions,
  menubarLayout,
  modals,
  projectSettings,
  projects,
  sidebar,
  syncTimeline,
  tasks,
  toasts,
  togglePanel,
  upload,
  userSearch,
  users,
  walkthrough
});
