import * as ProjectsActions       from 'stemn-frontend-shared/src/redux/actions/projects.js'

import * as TasksActions          from 'stemn-frontend-shared/src/misc/Tasks/Tasks.actions.js'
import * as ChangesActions        from 'stemn-frontend-shared/src/misc/Changes/Changes.actions.js'
import * as CommentsActions       from 'stemn-frontend-shared/src/misc/Comments/Comments.actions.js'
import * as NotificationsUtils    from 'stemn-frontend-shared/src/misc/Notifications/Notifications.utils.js'

import * as ProviderPathUtils     from 'stemn-frontend-shared/src/desktop/ProviderPath/ProviderPath.utils.js'
import * as AutoUpdateUtils       from 'stemn-frontend-shared/src/desktop/AutoUpdate/AutoUpdate.utils.js'

import * as ElectronWindowsUtils  from 'stemn-frontend-shared/src/desktop/ElectronWindows/ElectronWindows.utils.js'
import * as ShellContextUtils     from 'stemn-frontend-shared/src/desktop/Shell/ShellContext/ShellContext.utils.js'
import * as SystemUtils           from 'stemn-frontend-shared/src/desktop/System/System.utils.js'
import * as FileCache             from 'stemn-frontend-shared/src/desktop/FileCache/FileCache.js'

import { actions } from 'react-redux-form';

const library = {
  ProjectsActions,
  TasksActions,
  ChangesActions,
  CommentsActions,
  ProviderPathUtils,
  AutoUpdateUtils,
  ElectronWindowsUtils,
  NotificationsUtils,
  ShellContextUtils,
  SystemUtils,
  FileCache,
  FormActions: actions
}

export const addModule = (moduleName, functions) => {
  library[moduleName] = functions
}

export const getFunction = (path) => {
  const [moduleName, functionName] = path.split('.');

  // We are getting the module only
  if(!functionName){
    if(library[moduleName]){
      return library[moduleName]
    }
    else{
      console.error(`Module: ${moduleName} could not be found.`);
    }
  }
  // We are getting a function
  else{
    if(library[moduleName] && library[moduleName][functionName]){
      return library[moduleName][functionName]
    }
    else{
      console.error(`Function: ${moduleName}.${functionName} could not be found.`);
    }
  }
}
