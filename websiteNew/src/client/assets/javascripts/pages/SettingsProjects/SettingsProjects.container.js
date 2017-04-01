import React, { Component } from 'react';
import { connect } from 'react-redux';

import SettingsProjects from './SettingsProjects';

const stateToProps = () => ({});

const dispatchToProps = {

};

@connect(stateToProps, dispatchToProps)
export default class SettingsProjectsContainer extends Component {
  render() {
    return (
      <SettingsProjects {...this.props} />
    );
  }
}
