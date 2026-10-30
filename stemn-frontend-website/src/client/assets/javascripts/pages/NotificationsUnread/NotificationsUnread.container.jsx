import React from 'react'
import { useMarkNotificationRead, useNotifications } from 'stemn-shared/api/queries/notifications'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'
import NotificationsUnread from './NotificationsUnread'

const NotificationsUnreadContainer = (props) => {
  const notifications = useNotifications()
  const { mutate: markAsRead } = useMarkNotificationRead()
  return <NotificationsUnread {...props} notifications={toLegacyEntity(notifications)} markAsRead={markAsRead} />
}

export default NotificationsUnreadContainer
