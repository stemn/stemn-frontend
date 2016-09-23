import * as ProjectActions from '../../actions/projects.js';

const library = {
  ProjectActions: ProjectActions,
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
