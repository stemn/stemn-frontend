import React from 'react'
import { connect } from 'react-redux'
import classes from './UpdateTitleBarButton.module.css'
import { downloadedVersion, restartToUpdate } from './updates.js'

/** "Restart to update" in the main window's title bar, once an update is downloaded */
export const UpdateTitleBarButton = ({ autoUpdate, dispatch }) => {
  const version = downloadedVersion(autoUpdate)
  if (!version) return null
  return (
    <button
      type="button"
      className={classes.button}
      title={`Stemn ${version} has been downloaded. Restart to install it.`}
      onClick={() => dispatch(restartToUpdate())}
      data-testid="restart-to-update"
    >
      Restart to update
    </button>
  )
}

export default connect(({ autoUpdate }) => ({ autoUpdate }))(UpdateTitleBarButton)
