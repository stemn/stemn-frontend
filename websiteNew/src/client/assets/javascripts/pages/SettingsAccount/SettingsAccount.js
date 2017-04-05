import React, { Component, PropTypes } from 'react';

import UserNameSettings from 'stemn-shared/misc/UserSettings/UserNameSettings';
import UserEmailSettings from 'stemn-shared/misc/UserSettings/UserEmailSettings';
import InfoPanel from 'stemn-shared/misc/Panels/InfoPanel';

export default class SettingsAccount extends Component {
  render() {
    return (
      <div>
        <InfoPanel>
          <UserNameSettings />
        </InfoPanel>        
        <InfoPanel>
          <UserEmailSettings />
        </InfoPanel>
      </div>
    )
  }
}