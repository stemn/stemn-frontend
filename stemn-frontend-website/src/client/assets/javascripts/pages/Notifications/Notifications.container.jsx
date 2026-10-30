import React from 'react'
import { useMarkNotificationRead, useNotifications } from 'stemn-shared/api/queries/notifications'
import { toLegacyEntity } from 'stemn-shared/api/query/legacyShape'
import Notifications from './Notifications'

/** Notifications layout (TanStack Query: the list is shared with the header badge and the tabs) */
const NotificationsContainer = (props) => {
  const notifications = useNotifications()
  const { mutate: markAsRead } = useMarkNotificationRead()
  return <Notifications {...props} notifications={toLegacyEntity(notifications)} markAsRead={markAsRead} />
}

export default NotificationsContainer
