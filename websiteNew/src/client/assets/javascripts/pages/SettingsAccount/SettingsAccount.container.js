import React, { Component } from 'react';
import { connect } from 'react-redux';

import SettingsAccount from './SettingsAccount';

const stateToProps = () => ({});

const dispatchToProps = {

};

@connect(stateToProps, dispatchToProps)
export default class SettingsAccountContainer extends Component {
  render() {
    return (
      <SettingsAccount {...this.props} />
    );
  }
}
