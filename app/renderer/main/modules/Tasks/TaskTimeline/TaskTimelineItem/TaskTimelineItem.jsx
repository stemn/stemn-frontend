// Component Core
import React from 'react';
import moment from 'moment';

// Styles
import classNames from 'classnames';
import classes from './TaskTimelineItem.css';

import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx';



const EventData = React.createClass({
  render() {
    const { item } = this.props;
    if(item.event == 'commit'){
      return (
        <span>referenced this task in commit <a className="link-primary">#213</a></span>
      )
    }
    else if(item.event == 'closed'){
      return (
        <span>marked this as complete</span>
      )
    }
    else if(item.event == 'open'){
      return (
        <span>re-opened this task</span>
      )
    }
    else if(item.event == 'addAsignee'){
      return (
        <span>was assigned to this task</span>
      )
    }
    else if(item.event == 'removeAsignee'){
      return (
        <span>was removed from assignees</span>
      )
    }
    else if(item.event == 'changeLabels'){
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
      )
    }
  }
})


export default React.createClass({
  render() {
    const { item } = this.props;
    return (
      <div className="layout-row layout-align-start-center flex">
        <div className={classes.avatar}>
          <UserAvatar picture={item.user.picture} size="25" shape="square"/>
        </div>
        <div>
          <b>{item.user.name}&nbsp;</b><span className="text-grey-3"><EventData item={item}/> - {moment(item.timestamp).fromNow()}</span>
        </div>
      </div>
    )
  }
});
