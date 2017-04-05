import React, { Component, PropTypes } from 'react';

import classes from './UserStars.css';
import classNames from 'classnames';

export default class UserStars extends Component {
  render() {
    const { user } = this.props;
    return (
      <div>
        Stars
      </div>
    )
  }
}