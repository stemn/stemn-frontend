import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSettings, saveSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions'
import SettingsEmails from './SettingsEmails';

const stateToProps = ({ userSettings }) => ({
  toggleValues: userSettings.data.emails,
  toggleModel: 'userSettings.data.emails'
})

const dispatchToProps = {
  getSettings,
  saveSettings,
}

@connect(stateToProps, dispatchToProps)
export default class SettingsEmailsContainer extends Component {
  render() {
    return (
      <SettingsEmails {...this.props} />
    );
  }
}
