import * as ProjectActions from '../../actions/projects.js'
import * as TasksActions from '../../../renderer/main/modules/Tasks/Tasks.actions.js'
import * as ChangesActions from '../../../renderer/main/modules/Changes/Changes.actions.js'

const library = {
  ProjectActions,
  TasksActions,
  ChangesActions
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
