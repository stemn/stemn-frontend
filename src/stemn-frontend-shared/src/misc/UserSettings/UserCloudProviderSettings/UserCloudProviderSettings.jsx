import React, { Component } from 'react'
import PropTypes from 'prop-types'
import LinkAccount from 'stemn-shared/misc/Settings/LinkAccount/LinkAccount'

export default class UserCloudProviderSettings extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    authenticate: PropTypes.func.isRequired,
    unlink: PropTypes.func.isRequired,
  }
  render() {
    const { user, authenticate, unlink } = this.props
    return (
      <div>
        <h3>Cloud Providers</h3>
        <p>Link your cloud storage providers to Stemn. Your files and revision history will be automatically synced.</p>
        <br />
        <LinkAccount
          text="Dropbox"
          isLinked={ user.accounts.dropbox && user.accounts.dropbox.id }
          linkFn={ () => authenticate('dropbox') }
          unLinkFn={ () => unlink('dropbox') }
          email={ user.accounts.dropbox && user.accounts.dropbox.email ? user.accounts.dropbox.email : '' }
        />

        <LinkAccount
          text="Google Drive"
          isLinked={ user.accounts.google &&  user.accounts.google.refreshToken }
          linkFn={ () => authenticate('google') }
          unLinkFn={ () => unlink('google') }
          email={ user.accounts.google && user.accounts.google.email ? user.accounts.google.email : '' }
        />

      </div>
    )
  }
}
