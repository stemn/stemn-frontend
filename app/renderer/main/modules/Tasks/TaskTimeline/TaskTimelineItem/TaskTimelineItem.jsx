// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './TaskTimelineItem.css';

import UserAvatar from 'app/renderer/main/components/Avatar/UserAvatar/UserAvatar.jsx'

export default React.createClass({
  render() {
    return (
      <div className="layout-row layout-align-start-center flex">
        <div className={classes.avatar}>
          <UserAvatar size="25" shape="square"/>
        </div>
        <span><b>David Revay</b>&nbsp;added the the label: [gooba]</span>
      </div>
    )
  }
});
