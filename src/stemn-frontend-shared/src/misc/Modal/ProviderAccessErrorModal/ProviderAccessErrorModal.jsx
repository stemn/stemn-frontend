// Component Core
import React from 'react'

import Button from 'stemn-shared/misc/Buttons/Button/Button'
import { Link } from 'react-router'

class Component extends React.Component {
  render() {
    const {
      modalConfirm,
    } = this.props
    return (
      <div style={ { width: '500px' } }>
        <div className="modal-title">Google Authentication Error</div>
        <div className="modal-body" style={ { lineHeight: '1.4em' } }>
          <p>There is a problem with STEMN's access to your Google Account. Please follow these steps to re-connect your account.</p>
          <p className="text-mini-caps">Step 1:</p>
          <p>Visit Google's Permissions page <a className="link-primary" href="https://security.google.com/settings/security/permissions">here</a>. Find STEMN in the list and click 'Remove' to revoke access.</p>
          <p className="text-mini-caps">Step 2:</p>
          <p>After you have fully revoked STEMN's access to your google account, vist your <Link to="/settings/account" className="link-primary">account settings page</Link> and re-connect your google account. </p>
        </div>
        <div className="modal-footer-no-line layout-row layout-align-end">
          <Button className="primary" onClick={ modalConfirm }>Continue</Button>
        </div>
      </div>
    )
  }
}

export default Component
