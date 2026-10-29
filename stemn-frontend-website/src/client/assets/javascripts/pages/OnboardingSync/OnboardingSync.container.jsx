import React, { Component } from 'react'
import { connect } from 'react-redux'
import { authenticate, unlink } from 'stemn-shared/misc/Auth/Auth.actions'

import OnboardingSync from './OnboardingSync'

const stateToProps = ({ auth }) => ({
  user: auth.user,
})

const dispatchToProps = {
  authenticate,
  unlink,
}

class OnboardingSyncContainer extends Component {
  render() {
    return <OnboardingSync {...this.props} />
  }
}

export default connect(stateToProps, dispatchToProps)(OnboardingSyncContainer)
