import * as LocalPathActions from 'stemn-shared/desktop/LocalPath/LocalPath.actions.js'
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'
import { getFullPath }   from 'stemn-shared/misc/Files/Files.actions.js'
import { shell } from 'electron'
import errorModalName from 'stemn-shared/misc/Modal/ErrorModal'
import { normaliseSlashes } from 'stemn-shared/desktop/System/System.utils'

export function getProviderPath() {
  return (dispatch, getState) => {
    dispatch({
      type: 'SYSTEM/GET_PROVIDER_PATH',
      aliased: true,
      payload: {
        functionAlias: 'ProviderPathUtils.getPath',
        functionInputs: ['dropbox'],
      },
      meta: {
        provider: 'dropbox',
      },
    })
    dispatch({
      type: 'SYSTEM/GET_PROVIDER_PATH',
      aliased: true,
      payload: {
        functionAlias: 'ProviderPathUtils.getPath',
        functionInputs: ['drive'],
      },
      meta: {
        provider: 'drive',
      },
    })
  }
}

export function getInstallStatus() {
  return {
    type: 'SYSTEM/GET_INSTALL_STATUS',
    aliased: true,
    payload: {
      functionAlias: 'SystemUtils.getInstallStatus',
    },
  }
}

export function openExternal({ url, params }) {
  return {
    type: 'SYSTEM/OPEN_EXTERNAL',
    aliased: true,
    payload: {
      functionAlias: 'SystemUtils.openExternal',
      functionInputs: { url, params },
    },
  }
}

export function openFile({ location, path, projectId, provider }) {
  return (dispatch, getState) => {
    const showErrorDialog = ({ path }) => {
      dispatch(ModalActions.showModal({
        modalType: errorModalName,
        modalProps: {
          title: 'File could not be found',
          body: `Could not locate the file/folder:<div class="dr-input text-ellipsis" style="margin: 15px 0">${path}</div>You should double-check this file exists on your computer. Additionally, make sure you have not disabled syncing of this file/folder using Dropbox/Drive's selective-sync feature.`,
        },
      }))
    }

    const open = (fullPath) => {
      const fullPathNormalised = normaliseSlashes(fullPath)
      if (location) {
        const success = shell.showItemInFolder(fullPathNormalised)
        if (!success) { showErrorDialog({ path: fullPathNormalised }) }
        return dispatch({
          type: 'SYSTEM/OPEN_FILE_LOCATION',
          payload: { path: fullPathNormalised },
        })
      } 
      const success = shell.openItem(fullPathNormalised)
      if (!success) { showErrorDialog({ path: fullPathNormalised }) }
      dispatch({
        type: 'SYSTEM/OPEN_FILE',
        payload: { path: fullPathNormalised },
      })
    }

    const storeState = getState()
    return dispatch(getFullPath({ path, projectId, provider }))
      .then(open)
  }
}
