import React, { Component, PropTypes } from 'react'
import moment from 'moment'

import classNames from 'classnames'
import classes from './TimelineItem.css'

import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import Comment from 'stemn-shared/misc/Comments/Comment/Comment.jsx'
import TaskTimelineWrapper from 'stemn-shared/misc/Tasks/TaskTimeline/TaskTimelineWrapper/TaskTimelineWrapper'
import Link from 'stemn-shared/misc/Router/Link'
import TimelineItemText from './TimelineItemText'
// import TaskTimelinePanel   from '../TaskTimelinePanel/TaskTimelinePanel.jsx'



export default class TimelineItem extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['feed', 'user', 'file', 'task', 'project']),
    item: PropTypes.object,
  }
  render() {
    const { item, type } = this.props
    // If it is a comment, we use the comment component to display
    if(item.event == 'comment'){
      return (
        <Comment commentId={item.comment} />
      )
    }
    // Else, we add a text event
    else{
      return (
        <TaskTimelineWrapper style={ { marginLeft: '5px' } }>
          <div className={ classNames('layout-row layout-align-start-center flex', classes.item)}>
            <div className={ classes.avatar }>
              <UserAvatar picture={ item.user.picture } size={ 25 } shape="square"/>
            </div>
            <div>
              <b>{ item.user.name }&nbsp;</b>
              <span className="text-grey-3 text-ellipsis">
                <TimelineItemText item={ item } type={ type }/> - { moment(item.timestamp).fromNow() }
              </span>
            </div>
          </div>
        </TaskTimelineWrapper>
      )
    }
  }
};
