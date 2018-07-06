import React, { Component } from 'react'
import EmailAndNotificationToggles from 'stemn-shared/misc/UserSettings/EmailAndNotificationToggles'

class SettingsEmails extends Component {
  componentWillMount() {
    this.props.getSettings()
  }
  render() {
    const { toggleValues, toggleModel, saveSettings } = this.props
    return (
      <div>
        <EmailAndNotificationToggles
          type="mail"
          toggleValues={ toggleValues }
          toggleModel={ toggleModel }
          saveSettings={ saveSettings }
        />
      </div>
    )
  }
}

export default SettingsEmails
