import providerPathLookup from '../../main/modules/files/providerPathLookup.js';
import Promise from 'es6-promise';
import { shell } from 'electron';


export function getProviderPath() {
  return {
    type: 'SYSTEM/GET_PROVIDER_PATH',
    payload: Promise.all(['dropbox', 'drive', 'onedrive'].map(providerPathLookup)).then(response => {
      return {
        dropbox: response[0],
        drive: response[1],
        onedrive: response[2],
      }
    }).catch( error => console.log(error))
  };
}

export function openFileLocation({path}) {
  return (dispatch, getState) => {
    const rootPath = getState().system.providerPath['drive'];
    shell.showItemInFolder(rootPath)
    dispatch({
      type: 'SYSTEM/OPEN_FILE_LOCATION',
      payload: {}
    })
//  return {
//    type: 'SYSTEM/OPEN_FILE',
//  };
  }
}

export function openFile({path}) {
  return (dispatch, getState) => {
    const rootPath = getState().system.providerPath['drive'];
    shell.openFile(rootPath)
    dispatch({
      type: 'SYSTEM/OPEN_FILE',
      payload: {}
    })
//  return {
//    type: 'SYSTEM/OPEN_FILE',
//  };
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
