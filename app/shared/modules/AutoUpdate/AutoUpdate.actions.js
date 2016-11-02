export function currentVersion({version}) {
  return {
    type: 'AUTO_UPDATE/CURRENT_VERSION',
    payload: { version }
  };
}
export function checkForUpdates() {
  return {
    type: 'AUTO_UPDATE/CHECK_FOR_UPDATES',
    aliased: true,
    payload: {
      functionAlias : 'AutoUpdateUtils.checkForUpdates',
    }
  };
}

export function updateAvailable() {
  return {
    type: 'AUTO_UPDATE/UPDATE_AVAILABLE',
    payload: {}
  };
}

export function updateDownloaded(releaseNotes, releaseName, releaseDate, updateURL) {
  return {
    type: 'AUTO_UPDATE/UPDATE_DOWNLOADED',
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
    type: 'AUTO_UPDATE/UPDATE_ERROR',
    error: true,
    payload: error.message,
  };
}

export function updateNotAvailable() {
  return {
    type: 'AUTO_UPDATE/UPDATE_NOT_AVAILABLE',
    payload: {}
  };
}
