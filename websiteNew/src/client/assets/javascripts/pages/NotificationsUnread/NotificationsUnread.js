import React, { Component, PropTypes } from 'react'

import NotificationItem from 'stemn-shared/misc/Notifications/NotificationItem/NotificationItem'

export default class NotificationsUnread extends Component {
  render() {
    const { notifications, markAsRead } = this.props
    console.log(this.props)
    return (
      <div>
          { notifications && notifications.data
              ? notifications.data.map((notification) => (
                <NotificationItem
                  key={ notification._id }
                  notification={ notification }
                  markAsRead={ markAsRead }
                />
            ))
            : null }
      </div>
    )
  }
}
