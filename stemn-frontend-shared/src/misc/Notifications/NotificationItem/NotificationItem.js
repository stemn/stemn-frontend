import React, { Component } from 'react'
import classes from './NotificationItem.css'
import cn from 'classnames'

import moment from 'moment'

import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import MdDone from 'react-icons/md/done'
import NotificationLink from 'stemn-shared/misc/Notifications/NotificationLink'

export default class NotificationItem extends Component {
  render() {
    const { notification, markAsRead } = this.props

    const markRead = () => markAsRead(notification._id)
    const templateSplit = notification.template.split('$$')
    // templateSplit will contain a '' in the array everywhere we
    // need to insert a notificationLink
    let entityNumber = -1

    return (
      <div className={ cn(classes.notification, 'layout-row layout-align-start-start') }>
        <UserAvatar
          className={ classes.avatar1 }
          name={ notification.entities[0].display } 
          picture={ notification.picture1 }
          size="33"
          shape="square"
        />
        <div className="flex">
          <div className={ cn(classes.text) }>
            { templateSplit.map((item, idx) => {
              if (item === '') {
                // We iterate the entity number whenever we find an empty item
                // in our split template array
                entityNumber += 1
                return (
                  <NotificationLink key={ idx } entity={ notification.entities[entityNumber] }>
                    { notification.entities[entityNumber].display || 'untitled' }
                  </NotificationLink>
                )
              } 
              return <span key={ idx }>{ item }</span>
            }) }
            .
          </div>
          <div className={ classes.meta }>
            { moment(notification.timestamp).fromNow() }
          </div>
        </div>
        { notification.picture2
          ? <NotificationLink entity={ notification.entities[1] }>
            <UserAvatar
              className={ classes.avatar2 }
              picture={ notification.picture2 }
              size="33"
              shape="square"
            />
          </NotificationLink>
          : null }
        <a className={ cn(classes.mark, { [classes.markRead]: notification.read }) } onClick={ markRead }>
          <MdDone size={ 24 } />
        </a>

      </div>
    )
  }
}
