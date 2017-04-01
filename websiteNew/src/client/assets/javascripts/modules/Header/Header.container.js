import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './Header';

import { logout } from 'stemn-shared/misc/Auth/Auth.actions.js';

const stateToProps = ({ auth }) => ({
  auth
});

const dispatchToProps = {
  logout
};

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  render() {
    return (
      <Header {...this.props} />
    );
  }
}