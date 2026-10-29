import React, { Component } from 'react'
import { connect } from 'react-redux'
import LoginPage from 'stemn-shared/pages/Login/Login'
import LandingLayout from 'layout/LandingLayout'
import { Helmet } from 'react-helmet-async'
import { nextBackground, authenticate, login } from 'stemn-shared/misc/Auth/Auth.actions.js'

const stateToProps = ({ auth }) => ({
  auth,
})

const dispatchToProps = {
  nextBackground,
  authenticate,
  login,
}

class LoginContainer extends Component {
  render() {
    return (
      <LandingLayout>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <LoginPage {...this.props} />
      </LandingLayout>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(LoginContainer)
