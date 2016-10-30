import * as LocalPathActions from '../modules/LocalPath/LocalPath.actions.js';
import { name as localPathModuleName} from '../modules/LocalPath/LocalPath.reducer.js';

//import providerPathLookup from '../../main/modules/files/providerPathLookup.js';

import Promise from 'es6-promise';
import { shell } from 'electron';
import { has } from 'lodash';

export function getProviderPath() {
  return {
    type: 'SYSTEM/GET_PROVIDER_PATH',
    aliased: true,
    payload: {
      functionAlias : 'ProviderPathActions.getPath',
      functionInputs: ['dropbox', 'drive']
    }
//    payload: Promise.all(['dropbox', 'drive'].map(providerPathLookup)).then(response => {
//      return {
//        dropbox: response[0],
//        drive: response[1]
//      }
//    }).catch( error => console.log(error))
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
      console.log(fullPath);
      if(location){
        const success = shell.showItemInFolder(fullPath);
        console.log(success);
        return dispatch({
          type: 'SYSTEM/OPEN_FILE_LOCATION',
          payload: {}
        })
      }else{
        const success = shell.openItem(fullPath);
        console.log(success);
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

export function currentVersion({version}) {
  return {
    type: 'SYSTEM/CURRENT_VERSION',
    payload: {version}
  };
}

export function checkingForUpdate() {
  return {
    type: 'SYSTEM/CHECKING_FOR_UPDATE',
    payload: {}
  };
}

export function updateAvailable() {
  return {
    type: 'SYSTEM/UPDATE_AVAILABLE',
    payload: {}
  };
}

export function updateDownloaded(releaseNotes, releaseName, releaseDate, updateURL) {
  return {
    type: 'SYSTEM/UPDATE_DOWNLOADED',
    payload: {
      releaseNotes,
      releaseName,
      releaseDate,
      updateURL,
    },
  };
}

export function updateError(error) {
  return {
    type: 'SYSTEM/UPDATE_ERROR',
    error: true,
    payload: error.message,
  };
}

export function updateNotAvailable() {
  return {
    type: 'SYSTEM/UPDATE_NOT_AVAILABLE',
    payload: {}
  };
}
