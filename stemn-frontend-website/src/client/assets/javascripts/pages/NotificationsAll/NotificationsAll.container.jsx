import React from 'react'
import { useMarkNotificationRead, useNotifications } from 'stemn-shared/api/queries/notifications'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'
import NotificationsAll from './NotificationsAll'

const NotificationsAllContainer = (props) => {
  const notifications = useNotifications()
  const { mutate: markAsRead } = useMarkNotificationRead()
  return <NotificationsAll {...props} notifications={toLegacyEntity(notifications)} markAsRead={markAsRead} />
}

export default NotificationsAllContainer
