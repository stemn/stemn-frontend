import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import NotificationsAll from './NotificationsAll'

import { markAsRead } from 'stemn-shared/misc/Notifications/Notifications.actions'

const stateToProps = ({ notifications }) => ({
  notifications,
})

const dispatchToProps = {
  markAsRead,
}

const fetchConfigs = []

class NotificationsAllContainer extends Component {
  render() {
    return <NotificationsAll {...this.props} />
  }
}

export default connect(stateToProps, dispatchToProps)(fetchDataHoc(fetchConfigs)(NotificationsAllContainer))
