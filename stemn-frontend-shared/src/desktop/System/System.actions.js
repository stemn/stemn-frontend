import * as LocalPathActions from 'stemn-shared/desktop/LocalPath/LocalPath.actions.js'
import * as ModalActions from 'stemn-shared/misc/Modal/Modal.actions.js'
import { getFullPath }   from 'stemn-shared/misc/Files/Files.actions'
import { getBridge } from 'stemn-shared/desktop/bridge'
import errorModalName from 'stemn-shared/misc/Modal/ErrorModal'
import { normaliseSlashes } from 'stemn-shared/desktop/System/normaliseSlashes'

// Looking up a provider that isn't installed rejects: that is reported in the store, not an error
const ignoreRejection = (result) => {
  if (result && typeof result.catch === 'function') result.catch(() => {})
  return result
}

export function getProviderPath() {
  return (dispatch) => {
    ['dropbox', 'drive'].forEach(provider => ignoreRejection(dispatch({
      type: 'SYSTEM/GET_PROVIDER_PATH',
      aliased: true,
      payload: {
        functionAlias: 'ProviderPathUtils.getPath',
        functionInputs: [provider],
      },
      meta: {
        provider,
      },
    })))
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

    // Runs in a renderer: the file is opened by the main process through the preload bridge
    const open = async (fullPath) => {
      const fullPathNormalised = normaliseSlashes(fullPath)
      const { shell } = getBridge()
      if (location) {
        const success = await shell.showItemInFolder(fullPathNormalised)
        if (!success) { showErrorDialog({ path: fullPathNormalised }) }
        return dispatch({
          type: 'SYSTEM/OPEN_FILE_LOCATION',
          payload: { path: fullPathNormalised },
        })
      }
      const error = await shell.openPath(fullPathNormalised)
      if (error) { showErrorDialog({ path: fullPathNormalised }) }
      return dispatch({
        type: 'SYSTEM/OPEN_FILE',
        payload: { path: fullPathNormalised },
      })
    }

    return dispatch(getFullPath({ path, projectId, provider }))
      .then(open)
  }
}
