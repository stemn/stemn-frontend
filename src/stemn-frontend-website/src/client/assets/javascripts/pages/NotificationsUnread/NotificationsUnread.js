import React, { Component } from 'react'
import NotificationItem from 'stemn-shared/misc/Notifications/NotificationItem/NotificationItem'

export default class NotificationsUnread extends Component {
  render() {
    const { notifications, markAsRead } = this.props
    const unreadNotifications = notifications && notifications.data
      ? notifications.data.filter(notification => !notification.read)
      : []

    return (
      <div>
        { unreadNotifications.length > 0
          ? unreadNotifications.map(notification => (
            <NotificationItem
              key={ notification._id }
              notification={ notification }
              markAsRead={ markAsRead }
            />
          ))
          : <div className="text-title-5">No unread notifications</div> }
      </div>
    )
  }
}
