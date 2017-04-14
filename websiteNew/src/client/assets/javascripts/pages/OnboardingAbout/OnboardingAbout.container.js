import React, { Component } from 'react'
import { connect } from 'react-redux'
import OnboardingAbout from './OnboardingAbout'

import { confirmLinkedinImport } from 'stemn-shared/misc/Auth/Auth.actions'

const stateToProps = ({ users, auth }) => ({
  user: users[auth.user._id],
  userModel: `users.${auth.user._id}`,
})

const dispatchToProps = {
  confirmLinkedinImport
}

@connect(stateToProps, dispatchToProps)
export default class OnboardingAboutContainer extends Component {
  render() {
    return (
      <OnboardingAbout {...this.props} />
    );
  }
}
