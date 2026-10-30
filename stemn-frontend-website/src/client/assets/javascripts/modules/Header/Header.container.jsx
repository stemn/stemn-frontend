import React from 'react'
import { connect } from 'react-redux'
import Header from './Header'

import { logout } from 'stemn-shared/misc/Auth/Auth.actions.js'
import { showModal } from 'stemn-shared/misc/Modal/Modal.actions.js'
import { selectUnread, useNotifications } from 'stemn-shared/api/queries/notifications'

import ProjectNewModalName from 'stemn-shared/misc/Projects/ProjectNewModal'

const stateToProps = ({ auth }) => ({
  auth,
})

const dispatchToProps = {
  logout,
  newProject: () => showModal({ modalType: ProjectNewModalName }),
}

const countUnread = (notifications) => selectUnread(notifications).length

/** The header is on every page: its notification query polls the list every minute while logged in */
const HeaderContainer = (props) => {
  const { data: numNotifications = 0 } = useNotifications(countUnread)
  return <Header {...props} numNotifications={numNotifications} />
}

export default connect(stateToProps, dispatchToProps)(HeaderContainer)
