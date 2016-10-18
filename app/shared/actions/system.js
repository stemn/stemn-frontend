import * as LocalPathActions from '../modules/LocalPath/LocalPath.actions.js';
import { name as localPathModuleName} from '../modules/LocalPath/LocalPath.reducer.js';

import providerPathLookup from '../../main/modules/files/providerPathLookup.js';

import Promise from 'es6-promise';
import { shell } from 'electron';

export function getProviderPath() {
  return {
    type: 'SYSTEM/GET_PROVIDER_PATH',
    payload: Promise.all(['dropbox', 'drive'].map(providerPathLookup)).then(response => {
      return {
        dropbox: response[0],
        drive: response[1]
      }
    }).catch( error => console.log(error))
  };
}

export function openFile({location, path, projectId, provider}) {
  return (dispatch, getState) => {

    const open = (computerToProvider, providerToProject, projectToFile) => {
      const fullPath = computerToProvider + providerToProject + projectToFile;
      console.log(fullPath);
      if(location){
        shell.showItemInFolder(fullPath)
        return dispatch({
          type: 'SYSTEM/OPEN_FILE_LOCATION',
          payload: {}
        })
      }else{
        shell.openFile(fullPath)
        dispatch({
          type: 'SYSTEM/OPEN_FILE',
          payload: {}
        })
      }
    };

    const computerToProvider = getState().system.providerPath[provider];
    const providerToProject  = getState()[localPathModuleName][projectId];

    if(!providerToProject){
      dispatch(LocalPathActions.getPath({projectId})).then(response => {
        const newProviderToProject  = getState()[localPathModuleName][projectId];
        return open(computerToProvider, newProviderToProject, path)
      })
    }
    else{
      return open(computerToProvider, providerToProject, path)
    }
  }
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
