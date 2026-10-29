import React, { Component } from 'react'
import { connect } from 'react-redux'
import RegisterPage from 'stemn-shared/pages/Register/Register'
import LandingLayout from 'layout/LandingLayout'
import { Helmet } from 'react-helmet-async'
import { nextBackground, authenticate, register } from 'stemn-shared/misc/Auth/Auth.actions.js'

const stateToProps = ({ auth }) => ({
  auth,
})

const dispatchToProps = {
  nextBackground,
  authenticate,
  register,
}

class LoginContainer extends Component {
  render() {
    return (
      <LandingLayout>
        <Helmet>
          <title>Register</title>
        </Helmet>
        <RegisterPage { ...this.props } />
      </LandingLayout>
    )
  }
}

export default connect(stateToProps, dispatchToProps)(LoginContainer)
