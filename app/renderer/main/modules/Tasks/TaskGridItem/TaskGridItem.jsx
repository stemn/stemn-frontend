import React from 'react';

import classNames from 'classnames';
import moment from 'moment';
import { Field, track } from 'react-redux-form';


import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import Textarea from 'app/renderer/main/components/Input/Textarea/Textarea';
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'

import classes from './TaskGridItem.css';

export default React.createClass({

  render() {
    const { item, index, entityModel } = this.props;
    return (
      <div id={item._id} className={classNames(classes.card, 'layout-row flex')}>
        <Checkbox />

        <div className={classes.text + ' flex'}>
          <Textarea
            model={track(`${entityModel}.items[].title`, { _id: this.props.item._id })}
            value={item.title}
            className="input-plain"
            type="text"
            placeholder="Task description" />
        </div>
        <UserAvatar picture={item.users[0].picture} size="25px"/>
      </div>
    )
  }
});
