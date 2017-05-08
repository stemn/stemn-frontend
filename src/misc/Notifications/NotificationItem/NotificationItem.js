import React, { Component, PropTypes } from 'react'
import classes from './NotificationItem.css'
import classNames from 'classnames'

import moment from 'moment'

import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx';
import MdDone from 'react-icons/md/done'
import Link from 'stemn-shared/misc/Router/Link'
import { getNotificationText } from 'stemn-shared/misc/Notifications/Notifications.utils'


class NotificationItem extends Component {
  render () {
    const { notification, markAsRead } = this.props

    const {
        _id: notificationId, type, read, timestamp,
        id1, name1, picture1, link1,
        id2, name2, picture2, link2,
    } = notification

    const markRead = () => markAsRead(notificationId)

    return (
      <div className={ classNames(classes.notification, 'layout-row layout-align-start-center') }>
        <Link className="layout-row layout-align-start-center" name="userRoute" params={ { link1 } }>
          <UserAvatar
            className={ classes.avatar1 }
            picture={ picture1 }
            size="33"
            shape="square"
          />
        </Link>
        <div className="flex">
          <div className="text-ellipsis">
            <Link className={ classNames('link-primary') } to={ link1 }>
              { name1 }
            </Link>
            <span>&nbsp;{ getNotificationText(type) }</span>
            <Link className={ classNames('link-primary') } to={ link2 }>
              &nbsp;{ name2 }
            </Link>
          </div>
          <div className={ classes.meta }>
            { moment(timestamp).fromNow() }
          </div>
        </div>
        { picture2
        ? <Link name="userRoute" params={ { link2 } }>
            <UserAvatar
              className={ classes.avatar2 }
              picture={ picture2 }
              size="33"
              shape="square"
            />
          </Link>
        : null }
        <a className={ classNames(classes.mark, {[classes.markRead] : read}) } onClick={ markRead }>
          <MdDone size={ 24 } />
        </a>

      </div>
    )
  }
}

export default NotificationItem
