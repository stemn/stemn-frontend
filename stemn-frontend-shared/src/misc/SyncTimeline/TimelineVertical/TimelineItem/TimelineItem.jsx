import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import classes from './TimelineItem.scss'

import UserAvatar from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx'
import Comment from 'stemn-shared/misc/Comments/Comment'
import CommentBody from 'stemn-shared/misc/Comments/CommentBody'
import TimelineWrapper from 'stemn-shared/misc/SyncTimeline/TimelineWrapper'
import Link from 'stemn-shared/misc/Router/Link'
import TimelineItemText from './TimelineItemText'

const groupLimit = 4

export default class TimelineItem extends Component {
  static propTypes = {
    type: PropTypes.oneOf(['feed', 'user', 'file', 'thread', 'project']),
    item: PropTypes.object,
    isFirst: PropTypes.bool,
    isLast: PropTypes.bool,
  }
  state = {
    expanded: false,
  }
  expand = () => {
    this.setState({
      expanded: true,
    })
  }
  render() {
    const { item, type, entity, isLast, isFirst, timelineCacheKey, forceExpand } = this.props
    const userRouteParams = { userId: item.user._id }

    const eventStyles = type === 'thread' ? { marginLeft: '30px' } : {}
    const { expanded } = this.state
    const isExpanded = expanded || forceExpand

    // If it is a comment, we use the comment component to display
    if (item.event === 'comment' && type === 'thread') {
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
    } 
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
              : <Link className="bold" name="userRoute" params={ userRouteParams }>{ item.user.name }&nbsp;</Link> }
            <span className={ classes.item }>
              <TimelineItemText item={ item } type={ type } entity={ entity } /> - { moment(item.timestamp).fromNow() }
            </span>
          </div>
          { isFirst && <div className={ classes.startMarker } /> }
          { isLast && <div className={ classes.endMarker } /> }
        </div>
        <div>
          { item.event === 'comment' && type !== 'thread' &&
          <CommentBody
            commentId={ item.data.comment }
          /> }
          { item.eventsGrouped && item.eventsGrouped.length > 0 &&
          <div className={ classes.group }>
            { item.eventsGrouped.slice(0, isExpanded ? 100 : groupLimit).map((event, idx) => (
              <div key={ idx } className={ classes.item }>
                <TimelineItemText className={ classes.item } item={ event } type={ type } entity={ entity } groupItem />
              </div>
            )) }
            { !isExpanded && item.eventsGrouped.length > groupLimit &&
            <div className={ classes.item }><a className="link-primary" onClick={ this.expand }>More...</a></div>
            }
          </div>
          }
        </div>
      </TimelineWrapper>
    )
  }
}
