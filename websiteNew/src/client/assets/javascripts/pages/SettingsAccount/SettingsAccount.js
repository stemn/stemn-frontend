import React, { Component, PropTypes } from 'react'

import UserNameSettings from 'stemn-shared/misc/UserSettings/UserNameSettings'
import UserEmailSettings from 'stemn-shared/misc/UserSettings/UserEmailSettings'
import UserLinkedAccountSettings from 'stemn-shared/misc/UserSettings/UserLinkedAccountSettings'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'

export default class SettingsAccount extends Component {
  render() {
    return (
      <div>
        <InfoPanel>
          <UserNameSettings entityModel={ 'auth.user' } />
        </InfoPanel>
        <InfoPanel>
          <UserEmailSettings />
        </InfoPanel>
        <InfoPanel>
          <UserLinkedAccountSettings />
        </InfoPanel>
      </div>
    )
  }
}
