import React, { Component } from 'react'
import { connect } from 'react-redux'

import SettingsProfileDetails from './SettingsProfileDetails'

import { saveUser } from 'stemn-shared/misc/Users/Users.actions'

const stateToProps = ({ users, auth }) => ({
  user: users[auth.user._id],
  currentUser: auth.user,
  entityModel: `users.${auth.user._id}`,
})

const dispatchToProps = {
  saveUser,
}

@connect(stateToProps, dispatchToProps)
export default class SettingsProfileDetailsContainer extends Component {
  render() {
    return (
      <SettingsProfileDetails { ...this.props } />
    )
  }
}
