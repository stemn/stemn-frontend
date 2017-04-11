import React, { Component, PropTypes } from 'react'
import classes from './NotificationItem.css'
import classNames from 'classnames'

import moment from 'moment'

import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx';

import Link from 'stemn-shared/misc/Router/Link'

const notificationText = {
    'added-project'                      : 'added you to their project',
    'added-organisation'                 : 'added you to the organisation',
    'invite-accepted'                    : 'joined',
    'followed-user-project'              : 'has a new project',
    'followed-user-blog'                 : 'has a new blog',
    'followed-user-general'              : 'has a new discussion',
    'followed-user-question'             : 'has a new question',
    'followed-project-blog'              : 'has a new blog',
    'followed-project-general'           : 'has a new discussion',
    'followed-project-question'          : 'has a new question',
    'followed-project-post'              : 'commented',
    'followed-field-project'             : 'has a new project',
    'followed-field-blog'                : 'has a new blog',
    'followed-field-general'             : 'has a new discussion',
    'followed-organisation-project'      : 'has a new project',
    'followed-field-question'            : 'has a new question',
    'followed-organisation-blog'         : 'has a new blog',
    'followed-organisation-general'      : 'has a new discussion',
    'followed-organisation-question'     : 'has a new question',
    'followed-own-user'                  : 'is now following you.',
    'followed-own-project'               : 'is now following your project',
    'followed-own-question'              : 'is now following your question',
    'followed-own-blog'                  : 'is now following your blog',
    'followed-own-general'               : 'is now following your discussion',
    'followed-own-organisation'          : 'is now following your organisation',
    'followed-question-post'             : 'posted an answer in',
    'followed-blog-post'                 : 'posted a comment on',
    'followed-general-post'              : 'posted a reply in',
    'own-question-post'                  : 'answered your question',
    'own-blog-post'                      : 'posted on your blog',
    'own-general-post'                   : 'replied in your discussion',
    'own-question-like'                  : 'liked your question',
    'own-blog-like'                      : 'liked your blog',
    'own-general-like'                   : 'liked your discussion',
    'own-post-like'                      : 'liked your post',
    'own-post-post'                      : 'replied to your post',
    'own-user-mention'                   : 'mentioned you in',
    'own-project-mention'                : 'mentioned your project in',
    'own-organisation-mention'           : 'mentioned your organisation in',
    'own-blog-mention'                   : 'mentioned your blog in',
    'own-general-mention'                : 'mentioned your discussion in',
    'own-question-mention'               : 'mentioned your question in',

    'own-application-pendingReview'      : 'application is now pending review.',
    'own-application-underReview'        : 'application is now under review.',
    'own-application-awaitingUpdate'     : 'application is awaiting update.',
    'own-application-readyToSubmit'      : 'application is now submitted.',
    'own-application-submittedToCompany' : 'application has been rejected.',
    'own-application-rejected'           : 'application has been rejected.',
    'own-application-processLater'       : 'application is now submitted.',
}

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
      <div className={ classNames(classes.notification, 'layout-row layout-align-start-center') } >

          <Link
            className={ classNames('link-primary', 'layout-row layout-align-start-center') }
            name="userRoute"
            params={ { link1 } }
          >
            <UserAvatar
              picture={picture1}
              size="33"
              shape="square"
          />
            <div>{ name1 }</div>
          </Link>

          <div>&nbsp;{ notificationText[type] }</div>

          <Link
            className={ classNames('link-primary') }
            name="userRoute"
            params={ { link2 } }
          >
            &nbsp;{ name2 }
          </Link>

          <div className={ classNames(classes.meta, 'layout-align-start-end') }>{ moment(timestamp).fromNow() }</div>

          <div className="flex" />
          <Link
            className={ classNames('link-primary') }
            name="userRoute"
            params={ { link2 } }
          >
            <UserAvatar picture={picture2} size="33" shape="square" />
          </Link>

          { !read && markAsRead
            ? <div onClick={ markRead }>mark as read</div>
            : null }
      </div>
    )
  }
}

export default NotificationItem
