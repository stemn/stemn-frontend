import { showConfirm } from 'stemn-shared/misc/Modal/Modal.actions.js'

export function currentVersion({ version }) {
  return {
    type: 'AUTO_UPDATE/CURRENT_VERSION',
    payload: { version },
  }
}
export function checkForUpdates() {
  return {
    type: 'AUTO_UPDATE/CHECK_FOR_UPDATES',
    aliased: true,
    payload: {
      functionAlias: 'AutoUpdateUtils.checkForUpdates',
    },
  }
}

export function updateAvailable() {
  return {
    type: 'AUTO_UPDATE/UPDATE_AVAILABLE',
    payload: {},
  }
}

export function updateDownloaded({ update, version, platform, readme }) {
  return (dispatch) => {
    dispatch({
      type: 'AUTO_UPDATE/UPDATE_DOWNLOADED',
      payload: {
        update,
        version,
        platform,
        readme,
      },
    })
    dispatch(showConfirm({
      title: 'Install update',
      message: 'A new update has been downloaded and is ready for installation. Would you like to restart Stemn Desktop now?',
    })).then(() => {
      dispatch({
        type: 'ALIASED',
        aliased: true,
        payload: {
          functionAlias: 'AutoUpdateUtils.installUpdates',
        },
      })
    })
  }
}

export function installUpdate() {
  return {
    type: 'AUTO_UPDATE/INSTALL_UPDATE',
    aliased: true,
    payload: {
      functionAlias: 'AutoUpdateUtils.installUpdates',
    },
  }
}

export function updateError(error) {
  return {
    type: 'AUTO_UPDATE/UPDATE_ERROR',
    error: true,
    payload: error.message,
  }
}

export function updateNotAvailable() {
  return {
    type: 'AUTO_UPDATE/UPDATE_NOT_AVAILABLE',
    payload: {},
  }
}
