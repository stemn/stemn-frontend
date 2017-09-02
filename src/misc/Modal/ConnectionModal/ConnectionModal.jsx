// Component Core
import React from 'react'

import Button from 'stemn-shared/misc/Buttons/Button/Button'

import MagnifyInternet   from 'stemn-shared/assets/images/pure-vectors/magnify-internet.svg'

// Styles
import classNames from 'classnames'

const Component = React.createClass({
  render() {
    const { title, message, modalCancel, modalConfirm } = this.props
    return (
      <div style={ { width: '100vw', padding: '30px' } }>
        <div className="modal-body" style={ { lineHeight: '1.4em' } }>
          <div className="text-center text-title-3">Connection Error</div>
          <div className="layout-row layout-align-center">
            <img src={ MagnifyInternet } />
          </div>
          <div className="text-center text-title-5">Could not connect to the remote server. Either the server or your internet is down.</div>
        </div>
      </div>
    )
  },
})

export default Component
