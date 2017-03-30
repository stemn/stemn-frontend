import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Settings from './Settings';

const stateToProps = () => ({});

const dispatchToProps = {

};

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  render() {
    return (
      <Settings {...this.props} />
    );
  }
}
