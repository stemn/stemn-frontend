// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './TaskTimelineItem.css';

import UserAvatar          from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import Comment             from 'app/renderer/main/modules/Comments/Comment/Comment.jsx';
import TaskTimelineWrapper from '../TaskTimelineWrapper/TaskTimelineWrapper.jsx';


const eventTextMap = {
  commit        : (item) => {return <span>referenced this task in commit <a className="link-primary">#213</a></span>},
  closed        : (item) => {return <span>marked this as complete</span>},
  open          : (item) => {return <span>re-opened this task</span>},
  addAsignee    : (item) => {return <span>was assigned to this task</span>},
  removeAsignee : (item) => {return <span>was removed from assignees</span>},
  changeLabels  : (item) => {
    return (
      <span>
      {item.added && item.added.length > 0
        ? <span>added the&nbsp;{item.added.map((label)=><span className={classes.label}>{label}</span>)}&nbsp;{item.added.length == 1 ? 'label' : 'labels'}</span>
        : null
      }
      {item.added && item.removed && item.added.length > 0 && item.removed.length>0
        ? <span>&nbsp;and&nbsp;</span> : null
      }
      {item.removed && item.removed.length > 0
        ? <span>removed the&nbsp;{item.removed.map((label)=><span className={classes.label}>{label}</span>)}&nbsp;{item.removed.length == 1 ? 'label' : 'labels'}</span>
        : null
      }
    </span>
  )},
}

const getTextEventData = (item) => {
  return eventTextMap[item.event] ? eventTextMap[item.event](item) : <span>Unknown Event Type</span>
};


export default React.createClass({
  render() {
    const { item } = this.props;
    // If it is a comment, we use the comment component to display
    if(item.event == 'comment'){
      return (
        <div>Comment</div>
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
              <b>{item.user.name}&nbsp;</b><span className="text-grey-3">{getTextEventData(item)} - {moment(item.timestamp).fromNow()}</span>
            </div>
          </div>
        </TaskTimelineWrapper>
      )
    }
  }
});
