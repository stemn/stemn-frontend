// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './TaskTimelineItem.css';

import UserAvatar          from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import Comment             from 'app/renderer/main/modules/Comments/Comment/Comment.jsx';
import TaskTimelineWrapper from '../TaskTimelineWrapper/TaskTimelineWrapper.jsx';
import TaskLabelDots       from '../../TaskLabelDots/TaskLabelDots.jsx'

const eventTextMap = {
  commit        : (item, board) => {return <span>referenced this task in commit <a className="link-primary">#213</a></span>},
  closed        : (item, board) => {return <span>marked this as complete</span>},
  open          : (item, board) => {return <span>re-opened this task</span>},
  addAsignee    : (item, board) => {return <span>was assigned to this task</span>},
  removeAsignee : (item, board) => {return <span>was removed from assignees</span>},
  changedLabels : (item, board) => {
    return (
      <span>
      {item.addedLabels && item.addedLabels.length > 0
        ? <span>added the&nbsp;<TaskLabelDots labels={item.addedLabels} labelInfo={board.data.labels} tag={true}/>&nbsp;{item.addedLabels.length == 1 ? 'label' : 'labels'}</span>
        : null
      }
      {item.addedLabels && item.removedLabels && item.addedLabels.length > 0 && item.removedLabels.length>0
        ? <span>&nbsp;and&nbsp;</span> : null
      }
      {item.removedLabels && item.removedLabels.length > 0
        ? <span>removed the&nbsp;<TaskLabelDots labels={item.removedLabels} labelInfo={board.data.labels} tag={true}/>&nbsp;{item.removedLabels.length == 1 ? 'label' : 'labels'}</span>
        : null
      }
    </span>
  )},
}

const getTextEventData = (item, board) => {
  return eventTextMap[item.event] ? eventTextMap[item.event](item, board) : <span>Unknown Event Type</span>
};


export default React.createClass({
  render() {
    const { item, board } = this.props;
    // If it is a comment, we use the comment component to display
    if(item.event == 'comment'){
      return (
        <Comment commentId={item.comment} style={{marginTop: '15px'}}></Comment>
      )
    }
    // Else, we add a text event
    else{
      return (
        <TaskTimelineWrapper>
          <div className="layout-row layout-align-start-center flex">
            <div className={classes.avatar}>
              <UserAvatar picture={item.user.picture} size="25" shape="square"/>
            </div>
            <div>
              <b>{item.user.name}&nbsp;</b><span className="text-grey-3">{getTextEventData(item, board)} - {moment(item.timestamp).fromNow()}</span>
            </div>
          </div>
        </TaskTimelineWrapper>
      )
    }
  }
});
