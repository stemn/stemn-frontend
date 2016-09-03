import React, { PropTypes } from 'react';

import moment from 'moment';
import { track } from 'react-redux-form';

import Checkbox from 'app/renderer/main/components/Input/Checkbox/Checkbox';
import Textarea from 'app/renderer/main/components/Input/Textarea/Textarea';
import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'

import classNames from 'classnames';
import classes from './Card.css';

const propTypes = {
  item: PropTypes.object.isRequired,
  style: PropTypes.object
};

const Card = React.createClass({
  render() {
    const { style, item, x, y, entityModel } = this.props;
    console.log(this.props);

    return (
      <div style={style} className={classNames(classes.card, 'layout-row flex')} id={style ? item.id : null}>
        <Checkbox />
        <div className={classes.text + ' flex'}>
          <Textarea
            model={`${entityModel}.items[${x}].cards[${y}].title`}
            value={item.title}
            className="input-plain"
            type="text"
            placeholder="Task description" />
        </div>
        <UserAvatar picture={item.users[0].picture} size="25px"/>
      </div>
    );
  }
});


Card.propTypes = propTypes;

export default Card;


//            model={track(`${entityModel}.items[].title`, { _id: this.props.item._id })}
