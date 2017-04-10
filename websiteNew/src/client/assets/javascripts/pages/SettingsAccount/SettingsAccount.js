import React, { Component, PropTypes } from 'react'

import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import UserNameSettings from 'stemn-shared/misc/UserSettings/UserNameSettings'
import UserEmailSettings from 'stemn-shared/misc/UserSettings/UserEmailSettings'
import UserLinkedAccountSettings from 'stemn-shared/misc/UserSettings/UserLinkedAccountSettings'
import UserCloudProviderSettings from 'stemn-shared/misc/UserSettings/UserCloudProviderSettings'
import UserBetaSettings from 'stemn-shared/misc/UserSettings/UserBetaSettings'

export default class SettingsAccount extends Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    authenticate: PropTypes.func.isRequired,
    unlink: PropTypes.func.isRequired,
    updateEmail: PropTypes.func.isRequired,
  }
  render() {
    const { user, authenticate, unlink, updateEmail } = this.props
    return (
      <div>
        <InfoPanel>
          <UserBetaSettings
            user={ user }
          />
        </InfoPanel>

        <InfoPanel>
          <UserLinkedAccountSettings
            user={ user }
            authenticate={ authenticate }
            unlink={ unlink }
          />
        </InfoPanel>

        <InfoPanel>
          <UserCloudProviderSettings
            user={ user }
            authenticate={ authenticate }
            unlink={ unlink }
          />
        </InfoPanel>

        <InfoPanel>
          <UserNameSettings entityModel={ 'auth.user' } />
        </InfoPanel>

        <InfoPanel>
          <UserEmailSettings
            user={ user }
            updateEmail={ updateEmail }
          />
        </InfoPanel>

      </div>
    )
  }
}
