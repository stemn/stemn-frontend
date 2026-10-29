import React, { Component } from 'react'
import { connect } from 'react-redux'
import Download from './Download'

import { getLatest } from 'stemn-shared/misc/DesktopReleases/DesktopReleases.actions'

const stateToProps = ({ desktopReleases }) => ({
  latest: desktopReleases.latest,
})

const dispatchToProps = {
}

class DownloadContainer extends Component {
  render() {
    return (
      <Download { ...this.props } />
    )
  }
}

export default connect(stateToProps, dispatchToProps)(DownloadContainer)
