import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './Header'

import { logout } from 'stemn-shared/misc/Auth/Auth.actions.js'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'

import ProjectNewModalName from 'stemn-shared/misc/Projects/ProjectNewModal'

const stateToProps = ({ auth, notifications }) => ({
  auth,
  numNotifications: notifications.data.filter(notification => !notification.read).length,
})

const dispatchToProps = {
  logout,
  newProject: () => showModal({ modalType: ProjectNewModalName }),
}

@connect(stateToProps, dispatchToProps)
export default class LoginContainer extends Component {
  render() {
    return (
      <Header { ...this.props } />
    )
  }
}
