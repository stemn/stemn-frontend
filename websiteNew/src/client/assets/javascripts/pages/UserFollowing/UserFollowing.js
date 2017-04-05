import React, { Component, PropTypes } from 'react';

import classes from './UserFollowing.css';
import classNames from 'classnames';

export default class UserFollowing extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
        Following
      </div>
    )
  }
}