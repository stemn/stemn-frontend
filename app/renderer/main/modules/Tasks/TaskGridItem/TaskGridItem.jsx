import React from 'react';

import classNames from 'classnames';
import moment from 'moment';

import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'

import classes from './TaskGridItem.css';

export default React.createClass({
  render() {
    const { item } = this.props;
    return (
      <div id={item._id} className={classNames(classes.card, 'layout-row flex')}>
        <Checkbox />
        <div className={classes.text + ' flex'}>{item.title}</div>
        <UserAvatar picture={item.users[0].picture} size="25px"/>
      </div>
    )
  }
});
