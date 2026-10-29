import React, { Component } from 'react'
import { connect } from 'react-redux'
import Header from './Header'

import { logout } from 'stemn-shared/misc/Auth/Auth.actions'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'

import ProjectNewModalName from 'stemn-shared/misc/Projects/ProjectNewModal'

const stateToProps = ({ auth, notifications }) => ({
  auth,
  numNotifications: notifications.data.filter((notification) => !notification.read).length,
})

const dispatchToProps = {
  logout,
  newProject: () => showModal({ modalType: ProjectNewModalName }),
}

class LoginContainer extends Component {
  render() {
    return <Header {...this.props} />
  }
}

export default connect(stateToProps, dispatchToProps)(LoginContainer)
