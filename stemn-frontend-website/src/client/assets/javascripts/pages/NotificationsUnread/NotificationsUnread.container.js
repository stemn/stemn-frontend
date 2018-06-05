import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import NotificationsUnread from './NotificationsUnread'

import { markAsRead } from 'stemn-shared/misc/Notifications/Notifications.actions'

const stateToProps = ({ notifications }) => ({
  notifications,
})

const dispatchToProps = {
  markAsRead,
}

const fetchConfigs = []

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class NotificationsUnreadContainer extends Component {
  render() {
    return <NotificationsUnread { ...this.props } />
  }
}
