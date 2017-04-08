// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './TaskTimelineItem.css';

import UserAvatar          from 'stemn-shared/misc/Avatar/UserAvatar/UserAvatar.jsx';
import Comment             from 'stemn-shared/misc/Comments/Comment/Comment.jsx';
import TaskTimelineWrapper from '../TaskTimelineWrapper/TaskTimelineWrapper.jsx';
import TaskLabelDots       from '../../TaskLabelDots/TaskLabelDots.jsx'
import Link                from 'stemn-shared/misc/Router/Link';
// import TaskTimelinePanel   from '../TaskTimelinePanel/TaskTimelinePanel.jsx'

const eventTextMap = {
  uncompleted   : (item, board) => {return <span>re-opened this task</span>},
  addAsignee    : (item, board) => {return <span>was assigned to this task</span>},
  removeAsignee : (item, board) => {return <span>was removed from assignees</span>},
  commit        : (item, board) => {
    return <span>referenced this task in commit <Link path={`/project/${item.data.project._id}/feed`} show closeModals query={{ item: item._id }} scope="main" className="link-primary">{item.data.summary}</Link></span>
  },
  completed     : (item, board) => {
    if(item.data.summary){
      return <span>marked this as complete in commit <Link path={`/project/${item.data.project._id}/feed`} show closeModals query={{ item: item._id }} scope="main" className="link-primary">{item.data.summary}</Link></span>
    }
    else{
      return <span>marked this as complete</span>
    }
  },
  changedLabels : (item, board) => {
    return (
      <span>
      {item.data.addedLabels && item.data.addedLabels.length > 0
        ? <span>added the&nbsp;<TaskLabelDots labels={item.data.addedLabels} labelInfo={board.data.labels} tag={true}/>&nbsp;{item.data.addedLabels.length == 1 ? 'label' : 'labels'}</span>
        : null
      }
      {item.data.addedLabels && item.data.removedLabels && item.data.addedLabels.length > 0 && item.data.removedLabels.length>0
        ? <span>&nbsp;and&nbsp;</span> : null
      }
      {item.data.removedLabels && item.data.removedLabels.length > 0
        ? <span>removed the&nbsp;<TaskLabelDots labels={item.data.removedLabels} labelInfo={board.data.labels} tag={true}/>&nbsp;{item.data.removedLabels.length == 1 ? 'label' : 'labels'}</span>
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
        <Comment commentId={item.data.comment}></Comment>
      )
    }
    // Else, we add a text event
    else{
      return (
        <TaskTimelineWrapper style={{marginLeft: '85px'}}>
          <div className="layout-row layout-align-start-center flex">
            <div className={classes.avatar}>
              <UserAvatar picture={item.user.picture} size="25" shape="square"/>
            </div>
            <div>
              <b>{item.user.name}&nbsp;</b><span className="text-grey-3" style={{lineHeight: '1.5em'}}>{getTextEventData(item, board)} - {moment(item.timestamp).fromNow()}</span>
            </div>
          </div>
        </TaskTimelineWrapper>
      )
    }
  }
});
