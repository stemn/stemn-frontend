import React from 'react'
import { connect } from 'react-redux'
import { push } from 'stemn-shared/routing'
import classes from './UpdateBanner.module.css'
import { downloadedVersion, downloadUpdate, restartToUpdate } from './updates.js'

/**
 * Update banner of the tray ("menubar") window: "Restart to update" once an update is downloaded,
 * "Download" for an available beta update, and the download progress.
 */
export const UpdateBanner = ({ autoUpdate, dispatch }) => {
  const version = downloadedVersion(autoUpdate)
  const showDetails = () => dispatch(push({ pathname: '/settings/application', state: { meta: { scope: ['main'] } } }))

  if (version) {
    const refused = autoUpdate.installRefused && autoUpdate.installRefused.message
    return (
      <div className={classes.banner} data-testid="update-banner">
        <div className="layout-row layout-align-start-center">
          <div className="flex">Stemn {version} is ready to install.</div>
          <a className={classes.action} onClick={() => dispatch(restartToUpdate())}>
            Restart to update
          </a>
        </div>
        {refused ? <div className={classes.note}>{refused}</div> : null}
      </div>
    )
  }

  const available = autoUpdate.updateAvailable && autoUpdate.available
  if (available && autoUpdate.progress !== null && autoUpdate.progress !== undefined) {
    return (
      <div className={classes.banner} data-testid="update-banner">
        Downloading Stemn {available.version}... {autoUpdate.progress}%
      </div>
    )
  }
  if (available && !available.autoDownload) {
    return (
      <div className={classes.banner} data-testid="update-banner">
        <div className="layout-row layout-align-start-center">
          <div className="flex">Stemn {available.version} is available.</div>
          <a className={classes.action} onClick={showDetails}>
            Details
          </a>
          <a className={classes.action} onClick={downloadUpdate}>
            Download
          </a>
        </div>
      </div>
    )
  }
  return null
}

export default connect(({ autoUpdate }) => ({ autoUpdate }))(UpdateBanner)
