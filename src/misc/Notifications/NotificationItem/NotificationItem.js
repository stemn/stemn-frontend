import React, { Component, PropTypes } from 'react'
import classes from './NotificationItem.css'
import classNames from 'classnames'

import moment from 'moment'

import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx';
import MdDone from 'react-icons/md/done'
import Link from 'stemn-shared/misc/Router/Link'
import { getNotificationText } from 'stemn-shared/misc/Notifications/Notifications.utils'
import NotificationLink from 'stemn-shared/misc/Notifications/NotificationLink'

export default class NotificationItem extends Component {
  render () {
    const { notification, markAsRead } = this.props

    const markRead = () => markAsRead(notification._id)
    const templateSplit = notification.template.split('$$')
    // templateSplit will contain a '' in the array everywhere we
    // need to insert a notificationLink
    let entityNumber = -1

    return (
      <div className={ classNames(classes.notification, 'layout-row layout-align-start-center') }>
        <UserAvatar
          className={ classes.avatar1 }
          picture={ notification.picture1 }
          size="33"
          shape="square"
        />
        <div className="flex">
          <div className={ classNames(classes.text, 'text-ellipsis') }>
            { templateSplit.map((item, idx) => {
              if (item === '') {
                // We iterate the entity number whenever we find an empty item
                // in our split template array
                entityNumber = entityNumber + 1
                return <NotificationLink key={ idx } entity={ notification.entities[entityNumber] } />
              } else {
                return <span key={ idx }>{ item }</span>
              }
            }) }
            .
          </div>
          <div className={ classes.meta }>
            { moment(notification.timestamp).fromNow() }
          </div>
        </div>
        { notification.picture2
        ? <UserAvatar
            className={ classes.avatar2 }
            picture={ notification.picture2 }
            size="33"
            shape="square"
          />
        : null }
        <a className={ classNames(classes.mark, {[classes.markRead] : notification.read}) } onClick={ markRead }>
          <MdDone size={ 24 } />
        </a>

      </div>
    )
  }
}
