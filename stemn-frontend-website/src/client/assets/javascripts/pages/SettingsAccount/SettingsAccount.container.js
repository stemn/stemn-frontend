import React, { Component } from 'react'
import { connect } from 'react-redux'
import SettingsAccount from './SettingsAccount'
import { authenticate, unlink, setPrimaryEmail, passwordUpdate } from 'stemn-shared/misc/Auth/Auth.actions'
import { saveUser } from 'stemn-shared/misc/Users/Users.actions'

const stateToProps = ({ auth }) => ({
  auth,
})

const dispatchToProps = {
  authenticate,
  unlink,
  setPrimaryEmail,
  saveUser,
  passwordUpdate,
}

@connect(stateToProps, dispatchToProps)
export default class SettingsAccountContainer extends Component {
  render() {
    return (
      <SettingsAccount { ...this.props } />
    )
  }
}
