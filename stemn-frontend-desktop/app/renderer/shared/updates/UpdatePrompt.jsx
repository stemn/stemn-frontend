import React from 'react'
import { connect } from 'react-redux'
import { downloadedVersion, showReleaseNotes } from './updates.js'

// Once per version and session, also when the window is recreated
const prompted = new Set()

/**
 * Main window: when an update has been downloaded, show its release notes with
 * "Restart to update" / "Later" (the prompt the user answers; nothing restarts on its own).
 */
export class UpdatePrompt extends React.Component {
  componentDidMount() {
    this.prompt()
  }

  componentDidUpdate() {
    this.prompt()
  }

  prompt() {
    const { autoUpdate, dispatch } = this.props
    const version = downloadedVersion(autoUpdate)
    if (!version || prompted.has(version)) return
    prompted.add(version)
    dispatch(showReleaseNotes({ version, releaseNotes: autoUpdate.release.readme || '', downloaded: true })).catch(
      () => {},
    )
  }

  render() {
    return null
  }
}

export default connect(({ autoUpdate }) => ({ autoUpdate }))(UpdatePrompt)
