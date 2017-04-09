import React, { Component } from 'react'
import { connect } from 'react-redux'

import SettingsAccount from './SettingsAccount'
import { authenticate, unlink, updateEmail } from 'stemn-shared/misc/Auth/Auth.actions'

const stateToProps = ({ auth: { user } }) => ({
  user
})

const dispatchToProps = {
  authenticate,
  unlink,
  updateEmail
}

@connect(stateToProps, dispatchToProps)
export default class SettingsAccountContainer extends Component {
  render() {
    return (
      <SettingsAccount {...this.props} />
    )
  }
}
