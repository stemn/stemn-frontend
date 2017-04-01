import React, { Component } from 'react';
import { connect } from 'react-redux';

import SettingsEmails from './SettingsEmails';

const stateToProps = () => ({});

const dispatchToProps = {

};

@connect(stateToProps, dispatchToProps)
export default class SettingsEmailsContainer extends Component {
  render() {
    return (
      <SettingsEmails {...this.props} />
    );
  }
}
