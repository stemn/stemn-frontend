import React, { Component, PropTypes } from 'react';

import classes from './UserOverview.css';
import classNames from 'classnames';

export default class UserOverview extends Component {
  render() {
    const { user } = this.props;
    console.log(user);
    return (
      <div>
        { user.data.profile.profileDetails.summary }
      </div>
    )
  }
}
