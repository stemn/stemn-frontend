import React, { Component, PropTypes } from 'react'
import classes from './NotificationItem.css'
import classNames from 'classnames'

import moment from 'moment'

import Link from 'stemn-shared/misc/Router/Link'

class NotificationItem extends Component {
  render () {
    const { notification, markAsRead } = this.props

    const {
        _id: notificationId,
        _id1: id1,
        name1,
        blurb1,
        picture1,
        _id2: id2,
        name2,
        blurb2,
        picture2,
        timestamp,
    } = notification

    return (
      <div className={ classNames(classes.notification, 'layout-row', className) } >
        <div className="layout-column flex">
          <div className={ classNames('flex', classes.blurb) }>{ blurb1 }</div>
          <div className={ classes.meta }>{ moment(timestamp).fromNow() }</div>
        </div>
        <Link name="projectRoute" params={ { projectId: id1 } }>
          <img
            className={ classes.picture }
            src={`${GLOBAL_ENV.API_SERVER}${picture1}?size=feed-sm&crop=true`}
          />
        </Link>
      </div>
    )
  }
}

export default Project
