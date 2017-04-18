import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getSettings } from 'stemn-shared/misc/UserSettings/UserSettings.actions'
import SettingsEmails from './SettingsEmails';

const stateToProps = () => ({})

const dispatchToProps = {
  getSettings
}

@connect(stateToProps, dispatchToProps)
export default class SettingsEmailsContainer extends Component {
  render() {
    return (
      <SettingsEmails {...this.props} />
    );
  }
}
