import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import styles from './autoUpdater.css'

class AutoUpdater extends Component {
  static propTypes = {
    system: PropTypes.object.isRequired,
  }

  shouldComponentUpdate(nextProps) {
    // more frequent updates trigger re-opening of already closed snackbars
    return !isEqual(this.props.system, nextProps.system)
  }

  render() {
    const { system } = this.props
    const noop = () => {}

    return (
      <div>
        <div active={ system.checkingForUpdate } onTimeout={ noop } timeout={ 10000 }>
          <div className={ styles.snackbarIconContainer }>
            <div />
            <div className={ styles.snackbarIconText }>
              Checking for updates...
            </div>
          </div>
        </div>

        <div active={ system.updateAvailable } onTimeout={ noop } timeout={ 10000 }>
          <div className={ styles.snackbarIconContainer }>
            <div />
            <span className={ styles.snackbarIconText }>
              There's an update available. Downloading...
            </span>
          </div>
        </div>

        <div active={ system.updateDownloaded } onTimeout={ noop } timeout={ 50000 }>
          <div className={ styles.snackbarIconContainer }>
            <div name="new_releases" />
            <span className={ styles.snackbarIconText }>
              Update <strong>{system.release.releaseName}</strong> downloaded.
              Restart to apply.
            </span>
          </div>
        </div>

        <div active={ !!system.updateError } onTimeout={ noop } timeout={ 10000 }>
          <div className={ styles.snackbarIconContainer }>
            <div name="sentiment_very_dissatisfied" />
            <span className={ styles.snackbarIconText }>
              An error occurred downloading updates
            </span>
          </div>
        </div>

        <div active={ system.updateNotAvailable } onTimeout={ noop } timeout={ 2000 }>
          <div className={ styles.snackbarIconContainer }>
            <div name="sentiment_very_satisfied" />
            <span className={ styles.snackbarIconText }>
              Timesheets is up-to-date
            </span>
          </div>
        </div>
      </div>
    )
  }
}

export default AutoUpdater
