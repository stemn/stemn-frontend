import * as LocalPathActions from '../LocalPath/LocalPath.actions.js';
import * as ModalActions from '../../../renderer/main/modules/Modal/Modal.actions.js';

import { name as localPathModuleName} from '../LocalPath/LocalPath.reducer.js';

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

export function getInstallStatus() {
  return {
    type: 'SYSTEM/GET_INSTALL_STATUS',
    aliased: true,
    payload: {
      functionAlias : 'SystemUtils.getInstallStatus',
    }
  };
}

export function openFile({location, path, projectId, provider}) {
  return (dispatch, getState) => {

    const addSlash = (path) => {
      return path && path[0] != '/' && path[0] != '\\' ? '/' + path : path
    }

    const showErrorDialog = ({path}) => {
      dispatch(ModalActions.showModal({
        modalType: 'ERROR',
        modalProps: {
          title: 'File could not be found',
          body: `Could no locate the file/folder:<div class="dr-input text-ellipsis" style="margin: 15px 0">${path}</div>You should double-check this file exists on your computer. Additionally, make sure you have not disabled sync using dropbox/drive's selective-sync feature.`
        }
      }))
    }

    const open = (computerToProvider, providerToProject, projectToFile) => {
      providerToProject = addSlash(providerToProject)
      projectToFile = addSlash(projectToFile)
      const fullPath = computerToProvider + providerToProject + projectToFile;
      if(location){
        const success = shell.showItemInFolder(fullPath);
        if(!success){showErrorDialog({path: fullPath})};
        return dispatch({
          type: 'SYSTEM/OPEN_FILE_LOCATION',
          payload: { path: fullPath }
        })
      }else{
        const success = shell.openItem(fullPath);
        if(!success){showErrorDialog({path: fullPath})};
        dispatch({
          type: 'SYSTEM/OPEN_FILE',
          payload: { path: fullPath }
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
