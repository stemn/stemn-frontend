import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import auth             from 'stemn-shared/misc/Auth/Auth.reducer.js'
import autosuggest      from 'stemn-shared/misc/Autosuggest/Autosuggest.reducer.js'
import changes          from 'stemn-shared/misc/Changes/Changes.reducer.js'
import codeSplitting    from 'stemn-shared/misc/CodeSplitting/CodeSplitting.reducer.js'
import comments         from 'stemn-shared/misc/Comments/Comments.reducer.js'
import commits          from 'stemn-shared/misc/Commits/Commits.reducer.js'
import desktopReleases  from 'stemn-shared/misc/DesktopReleases/DesktopReleases.reducer.js'
import fileCompare      from 'stemn-shared/misc/FileCompare/FileCompare.reducer.js'
import fileList         from 'stemn-shared/misc/FileList/FileList.reducer.js'
import fileSelect       from 'stemn-shared/misc/FileSelect/FileSelect.reducer.js'
import files            from 'stemn-shared/misc/Files/Files.reducer.js'
import header           from 'stemn-shared/misc/Header/Header.reducer.js'
import social           from 'stemn-shared/misc/Social/Social.reducer.js'
import mentions         from 'stemn-shared/misc/Mentions/Mentions.reducer.js'
import modals           from 'stemn-shared/misc/Modal/Modal.reducer.js'
import notifications    from 'stemn-shared/misc/Notifications/Notifications.reducer.js'
import projects         from 'stemn-shared/misc/Projects/Projects.reducer.js'
import search           from 'stemn-shared/misc/Search/Search.reducer.js'
import sidebar          from 'stemn-shared/misc/Sidebar/Sidebar.reducer.js'
import syncTimeline     from 'stemn-shared/misc/SyncTimeline/SyncTimeline.reducer.js'
import threads          from 'stemn-shared/misc/Threads/Threads.reducer.js'
import toasts           from 'stemn-shared/misc/Toasts/Toasts.reducer.js'
import togglePanel      from 'stemn-shared/misc/TogglePanel/TogglePanel.reducer.js'
import upload           from 'stemn-shared/misc/Upload/Upload.reducer.js'
import userFollowers    from 'stemn-shared/misc/UserFollowers/UserFollowers.reducer.js'
import userFollowing    from 'stemn-shared/misc/UserFollowing/UserFollowing.reducer.js'
import userStars        from 'stemn-shared/misc/UserStars/UserStars.reducer.js'
import users            from 'stemn-shared/misc/Users/Users.reducer.js'
import walkthrough      from 'stemn-shared/misc/Walkthrough/Walkthrough.reducer.js'
import fields           from 'stemn-shared/misc/Fields/Fields.reducer.js'
import relatedFields    from 'stemn-shared/misc/RelatedFields/RelatedFields.reducer.js'
import userSettings     from 'stemn-shared/misc/UserSettings/UserSettings.reducer.js'
import stringFilter     from 'stemn-shared/misc/StringFilter/StringFilter.reducer.js'
import history          from 'stemn-shared/misc/History/History.reducer.js'
import websocket        from 'stemn-shared/misc/Websocket/Websocket.reducer.js'
import pipelines        from 'stemn-shared/misc/Pipelines/Pipelines.reducer.js'
import terminal         from 'stemn-shared/misc/Terminal/Terminal.reducer.js'

import storeReducer     from 'stemn-shared/misc/Store/Store.reducer.js'

const splitReducers = combineReducers({
  auth,
  autosuggest,
  changes,
  codeSplitting,
  comments,
  history,
  commits,
  fileCompare,
  fileList,
  fileSelect,
  files,
  fields,
  header,
  social,
  mentions,
  modals,
  notifications,
  projects,
  routing,
  relatedFields,
  search,
  sidebar,
  syncTimeline,
  threads,
  toasts,
  togglePanel,
  upload,
  users,
  userFollowers,
  userFollowing,
  userStars,
  walkthrough,
  desktopReleases,
  userSettings,
  stringFilter,
  websocket,
  pipelines,
  terminal,
})

export default (state, action) => {
  const isStoreAction = action && action.type && action.type.startsWith('STORE/')
  return isStoreAction
    ? splitReducers(storeReducer(state, action), action) // This is fed into the split reducers so defaults can init if the keys are cleared
    : splitReducers(state, action)
}
