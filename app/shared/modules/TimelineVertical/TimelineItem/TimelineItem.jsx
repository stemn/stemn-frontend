// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from 'app/renderer/main/modules/Tasks/TaskTimeline/TaskTimelineItem/TaskTimelineItem.css';

import UserAvatar          from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';
import Comment             from 'app/renderer/main/modules/Comments/Comment/Comment.jsx';
import TaskTimelineWrapper from 'app/renderer/main/modules/Tasks/TaskTimeline/TaskTimelineWrapper/TaskTimelineWrapper.jsx';
import { Link }            from 'react-router';

// import TaskTimelinePanel   from '../TaskTimelinePanel/TaskTimelinePanel.jsx'

const eventTextMap = {
  revision   : (item) => {return <span>modified this file.</span>},
  commit     : (item) => {
    const linkPath = {
      pathname: `/project/${item.data.project}/feed`,
      query: {item: item.data._id}
    }
    return <span>added this file to commit: <Link to={linkPath} className="link-primary">{item.data.summary}</Link></span>
  },
}

const getTextEventData = (item) => {
  console.log(item.event);
  return eventTextMap[item.event] ? eventTextMap[item.event](item) : <span>Unknown Event Type</span>
};


export default React.createClass({
  render() {
    const { item } = this.props;
    // If it is a comment, we use the comment component to display
    if(item.event == 'comment'){
      return (
        <Comment commentId={item.comment}></Comment>
      )
    }
//    if(item.event == 'completed' && item.commits && item.commits[0]){
//      console.log(item);
//      const commit = item.commits[0];
//      return (
//        <TaskTimelinePanel item={item}>
//          <h3>{commit.summary}</h3>
//          <div>{commit.description}</div>
//        </TaskTimelinePanel>
//      )
//    }
    // Else, we add a text event
    else{
      return (
        <TaskTimelineWrapper style={{marginLeft: '5px'}}>
          <div className="layout-row layout-align-start-center flex">
            <div className={classes.avatar}>
              <UserAvatar picture={item.user.picture} size="25px" shape="square"/>
            </div>
            <div>
              <b>{item.user.name}&nbsp;</b><span className="text-grey-3" style={{lineHeight: '1.5em'}}>{getTextEventData(item)} - {moment(item.timestamp).fromNow()}</span>
            </div>
          </div>
        </TaskTimelineWrapper>
      )
    }
  }
});
