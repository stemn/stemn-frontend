import React, { Component } from 'react';
import { connect } from 'react-redux';

import SettingsProfile from './SettingsProfile';

const stateToProps = () => ({});

const dispatchToProps = {

};

@connect(stateToProps, dispatchToProps)
export default class SettingsProfileContainer extends Component {
  render() {
    return (
      <SettingsProfile {...this.props} />
    );
  }
}
