import { reducer as formReducer } from 'redux-form'
import autoLaunch from 'stemn-shared/desktop/AutoLaunch/AutoLaunch.reducer.js'
import autoUpdate from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.reducer.js'
import localPath from 'stemn-shared/desktop/LocalPath/LocalPath.reducer.js'
import system from 'stemn-shared/desktop/System/System.reducer.js'
import auth from 'stemn-shared/misc/Auth/Auth.reducer.js'
import autosuggest from 'stemn-shared/misc/Autosuggest/Autosuggest.reducer.js'
import changes from 'stemn-shared/misc/Changes/Changes.reducer.js'
import comments from 'stemn-shared/misc/Comments/Comments.reducer.js'
import { fileCompareReducer, IFileCompareState } from 'stemn-shared/misc/FileCompare/FileCompare.reducer'
import { fileListReducer, IFileListState } from 'stemn-shared/misc/FileList/FileList.reducer'
import { filesReducer, IFilesState } from 'stemn-shared/misc/Files/Files.reducer'
import fileSelect from 'stemn-shared/misc/FileSelect/FileSelect.reducer.js'
import header from 'stemn-shared/misc/Header/Header.reducer.js'
import mentions from 'stemn-shared/misc/Mentions/Mentions.reducer.js'
import modals from 'stemn-shared/misc/Modal/Modal.reducer.js'
import projects from 'stemn-shared/misc/Projects/Projects.reducer.js'
import search from 'stemn-shared/misc/Search/Search.reducer.js'
import sidebar from 'stemn-shared/misc/Sidebar/Sidebar.reducer.js'
import stringFilter from 'stemn-shared/misc/StringFilter/StringFilter.reducer.js'
import { ISyncTimelineState, syncTimelineReducer } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.reducer.js'
import threads from 'stemn-shared/misc/Threads/Threads.reducer.js'
import toasts from 'stemn-shared/misc/Toasts/Toasts.reducer.js'
import togglePanel from 'stemn-shared/misc/TogglePanel/TogglePanel.reducer.js'
import upload from 'stemn-shared/misc/Upload/Upload.reducer.js'
import users from 'stemn-shared/misc/Users/Users.reducer.js'
import walkthrough from 'stemn-shared/misc/Walkthrough/Walkthrough.reducer.js'
import websocket from 'stemn-shared/misc/Websocket/Websocket.reducer.js'

export interface IStoreState {
  fileList: IFileListState,
  fileCompare: IFileCompareState,
  files: IFilesState,
  syncTimeline: ISyncTimelineState,
}

export default {
  auth,
  autoLaunch,
  autoUpdate,
  autosuggest,
  changes,
  comments,
  fileCompare: fileCompareReducer,
  fileList: fileListReducer,
  fileSelect,
  files: filesReducer,
  header,
  localPath,
  mentions,
  modals,
  projects,
  search,
  sidebar,
  stringFilter,
  syncTimeline: syncTimelineReducer,
  system,
  threads,
  toasts,
  togglePanel,
  upload,
  users,
  walkthrough,
  websocket,
  formReducer,
}
