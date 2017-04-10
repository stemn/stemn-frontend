import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import Notifications from './NotificationsUnread'

import { markAsRead } from 'stemn-shared/misc/Notifications/Notifications.actions'

const stateToProps = ({ notifications }) => ({
  notifications
})

const dispatchToProps = {
  markAsRead
}

const fetchConfigs = []

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class NotificationsContainer extends Component {
  render() {
    return <Notifications {...this.props} />
  }
}
