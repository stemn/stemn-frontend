import React, { Component, PropTypes } from 'react';

import classes from './UserFollowers.css';
import classNames from 'classnames';

export default class UserFollowers extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
        Followers
      </div>
    )
  }
}
