import React, { Component, PropTypes } from 'react'
import moment from 'moment'

import classNames from 'classnames'
import classes from './TimelineItem.css'

import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import Comment from 'stemn-shared/misc/Comments/Comment'
import TimelineWrapper from 'stemn-shared/misc/SyncTimeline/TimelineWrapper'
import Link from 'stemn-shared/misc/Router/Link'
import TimelineItemText from './TimelineItemText'
// import TaskTimelinePanel   from '../TaskTimelinePanel/TaskTimelinePanel.jsx'



export default class TimelineItem extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['feed', 'user', 'file', 'task', 'project']),
    item: PropTypes.object,
  }
  render() {
    const { item, type, entity } = this.props
    const userRouteParams = { userId: item.user._id }
    const eventStyles = type === 'task'
      ? { marginLeft: '60px' }
      : {}

    // If it is a comment, we use the comment component to display
    if (item.event === 'comment' && type === 'task'){
      return (
        <Comment commentId={ item.data.comment } />
      )
    }
    // Else, we add a text event
    else{
      return (
        <TimelineWrapper className={ eventStyles }>
          <div className={ classNames('layout-row layout-align-start-center flex')}>
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
          </div>
        </TimelineWrapper>
      )
    }
  }
};
