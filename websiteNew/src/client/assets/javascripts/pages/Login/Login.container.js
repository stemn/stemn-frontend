import React, { Component } from 'react';
import { connect } from 'react-redux';
import LoginPage from 'stemn-shared/pages/Login/Login';
import LandingLayout from 'layout/LandingLayout'

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
      <LandingLayout>
        <LoginPage {...this.props} />
      </LandingLayout>
    );
  }
}
