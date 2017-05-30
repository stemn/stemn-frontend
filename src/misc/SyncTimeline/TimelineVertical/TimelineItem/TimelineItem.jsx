import React, { Component, PropTypes } from 'react'
import moment from 'moment'

import classNames from 'classnames'
import classes from './TimelineItem.css'

import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import Comment from 'stemn-shared/misc/Comments/Comment'
import CommentBody from 'stemn-shared/misc/Comments/CommentBody'
import TimelineWrapper from 'stemn-shared/misc/SyncTimeline/TimelineWrapper'
import Link from 'stemn-shared/misc/Router/Link'
import TimelineItemText from './TimelineItemText'

export default class TimelineItem extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['feed', 'user', 'file', 'thread', 'project']),
    item: PropTypes.object,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
  }
  render() {
    const { item, type, entity, isLast, isFirst, timelineCacheKey } = this.props
    const userRouteParams = { userId: item.user._id }

    const eventStyles = type === 'thread' ? { marginLeft: '30px' } : {}

    // If it is a comment, we use the comment component to display
    if (item.event === 'comment' && type === 'thread'){
      return (
        <Comment
          commentId={ item.data.comment }
          timelineCacheKey={ timelineCacheKey }
          showMeta={ type !== 'thread' }
        >
          <span className={ classes.item }>
            <TimelineItemText item={ item } type={ type } entity={ entity } />
          </span>
        </Comment>
      )
    } else {
      return (
        <TimelineWrapper style={ eventStyles }>
          <div className="layout-row layout-align-start-center flex">
            <Link name="userRoute" params={ userRouteParams } className={ classes.avatar }>
              <UserAvatar
                picture={ item.user.picture }
                size={ 25 }
                shape="square"
                name={ item.user.name }
              />
            </Link>
            <div>
              { type === 'user'
                ? null
                : <b>{ item.user.name }&nbsp;</b> }
              <span className={ classes.item }>
                <TimelineItemText item={ item } type={ type } entity={ entity } /> - { moment(item.timestamp).fromNow() }
              </span>
            </div>
            { isFirst && <div className={ classes.startMarker } /> }
            { isLast && <div className={ classes.endMarker } /> }
          </div>
          { item.event === 'comment' &&
            <CommentBody
              commentId={ item.data.comment }
            /> }
        </TimelineWrapper>
      )
    }
  }
};
