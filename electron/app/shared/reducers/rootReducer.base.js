import system           from 'stemn-frontend-shared/src/desktop/System/System.reducer.js';
import autoLaunch       from 'stemn-frontend-shared/src/desktop/AutoLaunch/AutoLaunch.reducer.js';
import autoUpdate       from 'stemn-frontend-shared/src/desktop/AutoUpdate/AutoUpdate.reducer.js';
import localPath        from 'stemn-frontend-shared/src/desktop/LocalPath/LocalPath.reducer.js';

import header           from 'stemn-frontend-shared/src/redux/reducers/header';
import auth             from 'stemn-frontend-shared/src/redux/reducers/auth';
import sidebar          from 'stemn-frontend-shared/src/redux/reducers/sidebar';
import projectSettings  from 'stemn-frontend-shared/src/redux/reducers/projectSettings';
import projects         from 'stemn-frontend-shared/src/redux/reducers/projects';
import users            from 'stemn-frontend-shared/src/redux/reducers/users';
import menubarLayout    from 'stemn-frontend-shared/src/redux/reducers/menubarLayout';

import userSearch       from 'stemn-frontend-shared/src/misc/UserSearch/UserSearch.reducer.js';
import fileList         from 'stemn-frontend-shared/src/misc/FileList/FileList.reducer.js';
import fileSelect       from 'stemn-frontend-shared/src/misc/FileSelect/FileSelect.reducer.js';
import modals           from 'stemn-frontend-shared/src/misc/Modal/Modal.reducer.js';
import upload           from 'stemn-frontend-shared/src/misc/Upload/Upload.reducer.js';
import tasks            from 'stemn-frontend-shared/src/misc/Tasks/Tasks.reducer.js';
import comments         from 'stemn-frontend-shared/src/misc/Comments/Comments.reducer.js';
import toasts           from 'stemn-frontend-shared/src/misc/Toasts/Toasts.reducer.js';
import fileCompare      from 'stemn-frontend-shared/src/misc/FileCompare/FileCompare.reducer.js';
import changes          from 'stemn-frontend-shared/src/misc/Changes/Changes.reducer.js';
import mentions         from 'stemn-frontend-shared/src/misc/Mentions/Mentions.reducer.js';
import files            from 'stemn-frontend-shared/src/misc/Files/Files.reducer.js';
import syncTimeline     from 'stemn-frontend-shared/src/misc/SyncTimeline/SyncTimeline.reducer.js';
import walkthrough      from 'stemn-frontend-shared/src/misc/Walkthrough/Walkthrough.reducer.js';
import togglePanel      from 'stemn-frontend-shared/src/misc/TogglePanel/TogglePanel.reducer.js';

export default {
  system,
  header,
  changes,
  auth,
  sidebar,
  syncTimeline,
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
  mentions,
  localPath,
  autoLaunch,
  autoUpdate,
  walkthrough,
  togglePanel
};
