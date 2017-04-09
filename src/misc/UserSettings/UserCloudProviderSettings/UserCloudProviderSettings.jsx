import React, { Component, PropTypes } from 'react'

import Input from 'stemn-shared/misc/Input/Input/Input'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton'
import LinkAccount from 'stemn-shared/misc/Settings/LinkAccount/LinkAccount'
import TextDisplayBox from 'stemn-shared/misc/TextDisplayBox/TextDisplayBox.jsx'

export default class UserCloudProviderSettings extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    authenticate: PropTypes.func.isRequired,
    unlink: PropTypes.func.isRequired,
  }
  render () {
    const { user, authenticate, unlink } = this.props
    return (
      <div>
        <h3>Cloud Providers</h3>
        <p>Link your cloud file storage to STEMN to track changes to your files.</p>

        <LinkAccount
          text="Dropbox"
          isLinked={user.accounts.dropbox && user.accounts.dropbox.id}
          linkFn={()=>authActions.authenticate('dropbox')}
          unLinkFn={()=>authActions.unlink('dropbox')}
          email={user.accounts.dropbox && user.accounts.dropbox.email ? user.accounts.dropbox.email : ''}/>

        <LinkAccount
          text="Google Drive"
          isLinked={user.accounts.google &&  user.accounts.google.refreshToken}
          linkFn={()=>authActions.authenticate('google')}
          unLinkFn={()=>authActions.unlink('google')}
          email={user.accounts.google && user.accounts.google.email ? user.accounts.google.email : ''}/>

      </div>
    )
  }
}
