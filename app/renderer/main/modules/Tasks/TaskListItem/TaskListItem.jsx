import React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'

import classes from './TaskListItem.css';

export default React.createClass({
  render() {
    const { item } = this.props;
    return (
      <div className={classNames(classes.taskListItem, 'layout-row flex layout-align-start-center')}>
        <Checkbox />
        <div className="flex text-ellipsis">{item.title}</div>
        <div className={classes.user + ' layout-row layout-align-start-center text ellipsis'}>
          <UserAvatar picture={item.users[0].picture} size="25px"/>
          <div style={{marginLeft: '10px'}}>{item.users[0].name}</div>
        </div>
        <div className={classes.date + ' text ellipsis'}>
          {moment(item.due).fromNow()}
        </div>
      </div>
    )
  }
});
