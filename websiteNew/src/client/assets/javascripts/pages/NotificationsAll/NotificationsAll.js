import React, { Component, PropTypes } from 'react'

import NotificationItem from 'stemn-shared/misc/Notifications/NotificationItem/NotificationItem'

export default class NotificationsUnread extends Component {
  render() {
    const { notifications, markAsRead } = this.props
    const allNotifications = notifications && notifications.data
      ? notifications.data
      : []

    return (
      <div>
        { allNotifications.length > 0
          ? allNotifications.map((notification) => (
            <NotificationItem
              key={ notification._id }
              notification={ notification }
              markAsRead={ markAsRead }
            />
          ))
          : 'No notifications' }
      </div>
    )
  }
}
