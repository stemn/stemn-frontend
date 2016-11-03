import * as LocalPathActions from '../modules/LocalPath/LocalPath.actions.js';
import { name as localPathModuleName} from '../modules/LocalPath/LocalPath.reducer.js';

import Promise from 'es6-promise';
import { shell } from 'electron';
import { has } from 'lodash';

export function getProviderPath() {
  return {
    type: 'SYSTEM/GET_PROVIDER_PATH',
    aliased: true,
    payload: {
      functionAlias : 'ProviderPathUtils.getPaths',
      functionInputs: [['dropbox', 'drive']]
    }
  };
}

export function openFile({location, path, projectId, provider}) {
  return (dispatch, getState) => {

    const addSlash = (path) => {
      return path && path[0] != '/' && path[0] != '\\' ? '/' + path : path
    }

    const open = (computerToProvider, providerToProject, projectToFile) => {
      providerToProject = addSlash(providerToProject)
      projectToFile = addSlash(projectToFile)
      const fullPath = computerToProvider + providerToProject + projectToFile;
      if(location){
        const success = shell.showItemInFolder(fullPath);
        return dispatch({
          type: 'SYSTEM/OPEN_FILE_LOCATION',
          payload: {}
        })
      }else{
        const success = shell.openItem(fullPath);
        dispatch({
          type: 'SYSTEM/OPEN_FILE',
          payload: {}
        })
      }
    };

    const storeState = getState();
    const computerToProvider = storeState.system.providerPath[provider];
    const providerToProject  = has(storeState, [localPathModuleName, projectId, 'data']) ? storeState[localPathModuleName][projectId].data : false;
        
    if(!providerToProject){
      dispatch(LocalPathActions.getPath({projectId})).then(response => {
        return open(computerToProvider, response.value.data, path)
      })
    }
    else{
      return open(computerToProvider, providerToProject, path)
    }
  }
}
