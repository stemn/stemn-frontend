import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { has } from 'lodash'
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import UserEmailSettings from 'stemn-shared/misc/UserSettings/UserEmailSettings'
import UserLinkedAccountSettings from 'stemn-shared/misc/UserSettings/UserLinkedAccountSettings'
import UserCloudProviderSettings from 'stemn-shared/misc/UserSettings/UserCloudProviderSettings'
import UserPasswordSettings from 'stemn-shared/misc/UserSettings/UserPasswordSettings'

export default class SettingsAccount extends Component {
  static propTypes = {
    auth: PropTypes.object.isRequired,
    authenticate: PropTypes.func.isRequired,
    unlink: PropTypes.func.isRequired,
    setPrimaryEmail: PropTypes.func.isRequired,
    saveUser: PropTypes.func.isRequired,
    passwordUpdate: PropTypes.func.isRequired,
  }
  render() {
    const { auth, authenticate, unlink, setPrimaryEmail, saveUser, passwordUpdate } = this.props
    return (
      <div>
        <InfoPanel>
          <UserLinkedAccountSettings
            user={ auth.user }
            authenticate={ authenticate }
            unlink={ unlink }
          />
        </InfoPanel>
        <InfoPanel>
          <UserCloudProviderSettings
            user={ auth.user }
            authenticate={ authenticate }
            unlink={ unlink }
          />
        </InfoPanel>
        <InfoPanel>
          <UserEmailSettings
            auth={ auth }
            setPrimaryEmail={ setPrimaryEmail }
            saveUser={ saveUser }
          />
        </InfoPanel>
        { has(auth, 'user.accounts.local.email') &&
          <InfoPanel>
            <UserPasswordSettings
              auth={ auth }
              passwordUpdate={ passwordUpdate }
            />
          </InfoPanel>
        }
      </div>
    )
  }
}

//        <InfoPanel>
//          <UserNameSettings
//            username={ user.stub }
//            usernameModel="auth.user"
//          />
//        </InfoPanel>
//        <InfoPanel>
//          <UserBetaSettings
//            user={ user }
//          />
//        </InfoPanel>
