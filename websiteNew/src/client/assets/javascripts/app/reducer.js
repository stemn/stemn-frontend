import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import auth             from 'stemn-shared/misc/Auth/Auth.reducer.js';
import autosuggest      from 'stemn-shared/misc/Autosuggest/Autosuggest.reducer.js';
import changes          from 'stemn-shared/misc/Changes/Changes.reducer.js';
import comments         from 'stemn-shared/misc/Comments/Comments.reducer.js';
import commits          from 'stemn-shared/misc/Commits/Commits.reducer.js';
import fileCompare      from 'stemn-shared/misc/FileCompare/FileCompare.reducer.js';
import fileList         from 'stemn-shared/misc/FileList/FileList.reducer.js';
import fileSelect       from 'stemn-shared/misc/FileSelect/FileSelect.reducer.js';
import files            from 'stemn-shared/misc/Files/Files.reducer.js';
import header           from 'stemn-shared/misc/Header/Header.reducer.js';
import likes            from 'stemn-shared/misc/Likes/Likes.reducer.js';
import mentions         from 'stemn-shared/misc/Mentions/Mentions.reducer.js';
import modals           from 'stemn-shared/misc/Modal/Modal.reducer.js';
import projects         from 'stemn-shared/misc/Projects/Projects.reducer.js';
import sidebar          from 'stemn-shared/misc/Sidebar/Sidebar.reducer.js';
import syncTimeline     from 'stemn-shared/misc/SyncTimeline/SyncTimeline.reducer.js';
import tasks            from 'stemn-shared/misc/Tasks/Tasks.reducer.js';
import toasts           from 'stemn-shared/misc/Toasts/Toasts.reducer.js';
import togglePanel      from 'stemn-shared/misc/TogglePanel/TogglePanel.reducer.js';
import upload           from 'stemn-shared/misc/Upload/Upload.reducer.js';
import users            from 'stemn-shared/misc/Users/Users.reducer.js';
import walkthrough      from 'stemn-shared/misc/Walkthrough/Walkthrough.reducer.js';

export default combineReducers({
  auth,
  changes,
  comments,
  commits,
  fileCompare,
  fileList,
  fileSelect,
  files,
  header,
  likes,
  mentions,
  modals,
  projects,
  routing,
  sidebar,
  syncTimeline,
  tasks,
  toasts,
  togglePanel,
  upload,
  autosuggest,
  users,
  walkthrough,
});
