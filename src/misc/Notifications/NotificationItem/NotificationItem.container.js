import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'

import NotificationItem from './NotificationItem'

import { markAsRead } from 'stemn-shared/misc/Notifications/Notifications.actions'

const stateToProps = {}

const dispatchToProps = {
  markAsRead
}

const fetchConfigs = []

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class ProjectContainer extends Component {
  render() {
    return (
      <NotificationItem {...this.props} />
    )
  }
}
