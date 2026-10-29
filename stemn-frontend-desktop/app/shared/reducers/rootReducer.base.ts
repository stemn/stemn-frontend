import autoLaunch from 'stemn-shared/desktop/AutoLaunch/AutoLaunch.reducer.js'
import autoUpdate from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.reducer.js'
import localPath from 'stemn-shared/desktop/LocalPath/LocalPath.reducer.js'
import system from 'stemn-shared/desktop/System/System.reducer.js'
import auth from 'stemn-shared/misc/Auth/Auth.reducer.js'
import autosuggest from 'stemn-shared/misc/Autosuggest/Autosuggest.reducer.js'
import changes from 'stemn-shared/misc/Changes/Changes.reducer.js'
import codeSplitting from 'stemn-shared/misc/CodeSplitting/CodeSplitting.reducer.js'
import comments from 'stemn-shared/misc/Comments/Comments.reducer.js'
import commits from 'stemn-shared/misc/Commits/Commits.reducer.js'
import { fileCompareReducer, IFileCompareState } from 'stemn-shared/misc/FileCompare/FileCompare.reducer'
import { fileListReducer, IFileListState } from 'stemn-shared/misc/FileList/FileList.reducer'
import { filesReducer, IFilesState } from 'stemn-shared/misc/Files/Files.reducer'
import fileSelect from 'stemn-shared/misc/FileSelect/FileSelect.reducer.js'
import header from 'stemn-shared/misc/Header/Header.reducer.js'
import history from 'stemn-shared/misc/History/History.reducer.js'
import mentions from 'stemn-shared/misc/Mentions/Mentions.reducer.js'
import modals from 'stemn-shared/misc/Modal/Modal.reducer.js'
import { pipelineGraphReducer } from 'stemn-shared/misc/Pipelines/PipelineGraph/PipelineGraph.reducer'
import pipelines from 'stemn-shared/misc/Pipelines/Pipelines.reducer.js'
import projects from 'stemn-shared/misc/Projects/Projects.reducer.js'
import search from 'stemn-shared/misc/Search/Search.reducer.js'
import sidebar from 'stemn-shared/misc/Sidebar/Sidebar.reducer.js'
import stringFilter from 'stemn-shared/misc/StringFilter/StringFilter.reducer.js'
import { ISyncTimelineState, syncTimelineReducer } from 'stemn-shared/misc/SyncTimeline/SyncTimeline.reducer'
import threads from 'stemn-shared/misc/Threads/Threads.reducer.js'
import toasts from 'stemn-shared/misc/Toasts/Toasts.reducer.js'
import togglePanel from 'stemn-shared/misc/TogglePanel/TogglePanel.reducer.js'
import upload from 'stemn-shared/misc/Upload/Upload.reducer.js'
import users from 'stemn-shared/misc/Users/Users.reducer.js'
import userSettings from 'stemn-shared/misc/UserSettings/UserSettings.reducer.js'
import walkthrough from 'stemn-shared/misc/Walkthrough/Walkthrough.reducer.js'
import websocket from 'stemn-shared/misc/Websocket/Websocket.reducer'

export interface IStoreState {
  fileList: IFileListState
  fileCompare: IFileCompareState
  files: IFilesState
  syncTimeline: ISyncTimelineState
}

export type IGetState = () => IStoreState

export default {
  auth,
  autoLaunch,
  autoUpdate,
  autosuggest,
  changes,
  codeSplitting,
  comments,
  commits,
  fileCompare: fileCompareReducer,
  fileList: fileListReducer,
  fileSelect,
  files: filesReducer,
  header,
  history,
  localPath,
  mentions,
  modals,
  pipelines,
  pipelineGraph: pipelineGraphReducer,
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
  userSettings,
  walkthrough,
  websocket,
}
