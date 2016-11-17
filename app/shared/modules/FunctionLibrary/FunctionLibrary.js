import * as ProjectsActions   from '../../actions/projects.js'
import * as TasksActions      from '../../../renderer/main/modules/Tasks/Tasks.actions.js'
import * as ChangesActions    from '../../../renderer/main/modules/Changes/Changes.actions.js'
import * as CommentsActions   from '../../../renderer/main/modules/Comments/Comments.actions.js'
import * as ProviderPathUtils from '../ProviderPath/ProviderPath.utils.js'
import * as AutoUpdateUtils   from '../AutoUpdate/AutoUpdate.utils.js'
import * as ElectronWindowsUtils   from '../ElectronWindows/ElectronWindows.utils.js'
import * as NotificationsUtils   from '../Notifications/Notifications.utils.js'

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
