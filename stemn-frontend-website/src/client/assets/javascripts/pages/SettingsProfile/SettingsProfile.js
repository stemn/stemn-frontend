import React, { Component } from 'react'

import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel'
import Textarea from 'stemn-shared/misc/Input/Textarea/Textarea'
import ProgressButton from 'stemn-shared/misc/Buttons/ProgressButton/ProgressButton.jsx'
import UserProfileSettings from 'stemn-shared/misc/UserSettings/UserProfileSettings'

export default class SettingsProfile extends Component {
  saveUser = () => {
    this.props.saveUser({
      user: this.props.user.data,
    })
  }
  render() {
    const { user, entityModel } = this.props
    return (
      <div>
        <InfoPanel>
          <UserProfileSettings
            user={ user }
            userModel={ entityModel }
            saveUser={ this.saveUser }
          />
        </InfoPanel>

        <InfoPanel>
          <h3>Detailed Summary</h3>
          <Textarea
            model={ `${entityModel}.data.profile.profileDetails.summary` }
            value={ user.data.profile.profileDetails.summary }
            className="dr-input"
            type="text"
            placeholder="Detailed summary"
          />
          <br />
          <ProgressButton
            className="primary"
            loading={ user.savePending }
            onClick={ this.saveUser }
          >
            Save Profile
          </ProgressButton>
        </InfoPanel>
      </div>
    )
  }
}

