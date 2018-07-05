// Component Core
import React from 'react'

import MagnifyInternet   from 'stemn-shared/assets/images/pure-vectors/magnify-internet.svg'

class Component extends React.Component {
  render() {
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
  }
}

export default Component
