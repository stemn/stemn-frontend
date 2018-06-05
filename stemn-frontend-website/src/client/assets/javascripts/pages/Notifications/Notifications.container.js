import React, { Component } from 'react'
import { connect } from 'react-redux'
import fetchDataHoc from 'stemn-shared/misc/FetchDataHoc'
import { getNotifications, markAsRead } from 'stemn-shared/misc/Notifications/Notifications.actions'
import Notifications from './Notifications'

const stateToProps = ({ notifications }) => ({
  notifications,
})

const dispatchToProps = {
  getNotifications,
  markAsRead,
}

const fetchConfigs = [{
  hasChanged: 'location.pathname',
  onChange: (props) => {
    props.getNotifications()
  },
}]

@connect(stateToProps, dispatchToProps)
@fetchDataHoc(fetchConfigs)
export default class NotificationsContainer extends Component {
  render() {
    return <Notifications { ...this.props } />
  }
}
