import React, { Component } from 'react'
import { connect } from 'react-redux'

import SettingsProfile from './SettingsProfile'

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
export default class SettingsProfileContainer extends Component {
  render() {
    return (
      <SettingsProfile { ...this.props } />
    )
  }
}
