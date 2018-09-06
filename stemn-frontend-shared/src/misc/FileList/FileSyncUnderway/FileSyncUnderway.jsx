import React, { Component } from 'react'
import PropTypes from 'prop-types'

import FileSyncIcon from './FileSyncIcon'

export default class FileSyncUnderway extends Component {
  static propTypes = {
    refresh: PropTypes.func.isRequired,
  }
  render() {    
    const { refresh } = this.props
    return (
      <div className="flex layout-column layout-align-center-center text-center" style={ { padding: '40px 15px' } }>
        <FileSyncIcon size={ 120 } />
        <div className="text-title-4" style={ { marginBottom: '10px' } }>Initial sync in progress</div>
        <div className="text-title-5">Your files are syncing from the cloud.<br />This may take a few minutes.<a className="link-primary" onClick={ refresh }> Refresh.</a></div>
      </div>
    )
  }
}
