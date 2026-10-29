/**
 * Auto-update actions. The updater runs in the main process
 * (stemn-frontend-desktop/app/main/updater) and reports its events with the plain actions below;
 * renderers trigger it through the preload bridge (`window.stemnDesktop.updates`) or the aliased
 * actions (FunctionLibrary `AutoUpdateUtils.*`).
 */
export function currentVersion({ version }) {
  return {
    type: 'AUTO_UPDATE/CURRENT_VERSION',
    payload: { version },
  }
}

/** The feed the updater polls: { channel: 'stable' | 'beta', edition: 'global' | 'eu', provider: 'generic' | 'github' } */
export function configured({ channel, edition, provider }) {
  return {
    type: 'AUTO_UPDATE/CONFIGURED',
    payload: { channel, edition, provider },
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

export function checking() {
  return {
    type: 'AUTO_UPDATE/CHECKING',
    payload: {},
  }
}

/** A newer version is on the feed. autoDownload: false means the user has to start the download (beta). */
export function updateAvailable({ version, releaseNotes, releaseDate, autoDownload } = {}) {
  return {
    type: 'AUTO_UPDATE/UPDATE_AVAILABLE',
    payload: { version, releaseNotes, releaseDate, autoDownload },
  }
}

export function downloadUpdate() {
  return {
    type: 'AUTO_UPDATE/DOWNLOAD_UPDATE',
    aliased: true,
    payload: {
      functionAlias: 'AutoUpdateUtils.downloadUpdate',
    },
  }
}

export function downloadProgress({ percent }) {
  return {
    type: 'AUTO_UPDATE/DOWNLOAD_PROGRESS',
    payload: { percent },
  }
}

/** The update is downloaded and verified: the UI offers "Restart to update" */
export function updateDownloaded({ update, version, platform, readme }) {
  return {
    type: 'AUTO_UPDATE/UPDATE_DOWNLOADED',
    payload: {
      update,
      version,
      platform,
      readme,
    },
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

/** quitAndInstall was refused, e.g. { reason: 'commit-in-progress', message } */
export function installRefused({ reason, message }) {
  return {
    type: 'AUTO_UPDATE/INSTALL_REFUSED',
    payload: { reason, message },
  }
}

export function updateError(error) {
  return {
    type: 'AUTO_UPDATE/UPDATE_ERROR',
    error: true,
    payload: error && error.message ? error.message : String(error),
  }
}

export function updateNotAvailable() {
  return {
    type: 'AUTO_UPDATE/UPDATE_NOT_AVAILABLE',
    payload: {},
  }
}
