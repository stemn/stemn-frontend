import * as ProjectsActions       from 'stemn-shared/misc/Projects/Projects.actions.js'
import * as ThreadsActions          from 'stemn-shared/misc/Threads/Threads.actions.js'
import * as ChangesActions        from 'stemn-shared/misc/Changes/Changes.actions.js'
import * as CommentsActions       from 'stemn-shared/misc/Comments/Comments.actions.js'
import * as NotificationsUtils    from 'stemn-shared/misc/Notifications/Notifications.utils.js'

import * as ProviderPathUtils     from 'stemn-shared/desktop/ProviderPath/ProviderPath.utils.js'
import * as AutoUpdateUtils       from 'stemn-shared/desktop/AutoUpdate/AutoUpdate.utils.js'

import * as ElectronWindowsUtils  from 'stemn-shared/desktop/ElectronWindows/ElectronWindows.utils.js'
import * as ShellContextUtils     from 'stemn-shared/desktop/Shell/ShellContext/ShellContext.utils.js'
import * as SystemUtils           from 'stemn-shared/desktop/System/System.utils.js'
import * as FileCache             from 'stemn-shared/desktop/FileCache/FileCache.js'

import * as StoreActions from 'stemn-shared/misc/Store/Store.actions'

const library = {
  ProjectsActions,
  ThreadsActions,
  ChangesActions,
  CommentsActions,
  ProviderPathUtils,
  AutoUpdateUtils,
  ElectronWindowsUtils,
  NotificationsUtils,
  ShellContextUtils,
  SystemUtils,
  FileCache,
  StoreActions,
}

export const addModule = (moduleName, functions) => {
  library[moduleName] = functions
}

export const getFunction = (path) => {
  const [moduleName, functionName] = path.split('.')

  // We are getting the module only
  if (!functionName) {
    if (library[moduleName]) {
      return library[moduleName]
    }
    
    console.error(`Module: ${moduleName} could not be found.`)
  }
  // We are getting a function
  else {
    if (library[moduleName] && library[moduleName][functionName]) {
      return library[moduleName][functionName]
    }
    
    console.error(`Function: ${moduleName}.${functionName} could not be found.`)
  }
}
