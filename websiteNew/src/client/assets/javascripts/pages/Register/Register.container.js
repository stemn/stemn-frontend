import React, { Component } from 'react';
import { connect } from 'react-redux';
import RegisterPage from 'stemn-shared/pages/Register/Register';
import LandingLayout from 'layout/LandingLayout'

import { nextBackground, authenticate, register } from 'stemn-shared/misc/Auth/Auth.actions.js';

const stateToProps = ({ auth }) => ({
  auth
});

const dispatchToProps = {
  nextBackground,
  authenticate,
  register
};

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  render() {
    return (
      <LandingLayout>
        <RegisterPage {...this.props} />
      </LandingLayout>
    );
  }
}
