import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginPage from 'stemn-shared/pages/Login/Login';

import { nextBackground, authenticate, login } from 'stemn-shared/misc/Auth/Auth.actions.js';

const stateToProps = ({ auth }) => ({
  auth
});

const dispatchToProps = {
  nextBackground,
  authenticate,
  login
};

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  render() {
    return (
      <LoginPage {...this.props} />
    );
  }
}