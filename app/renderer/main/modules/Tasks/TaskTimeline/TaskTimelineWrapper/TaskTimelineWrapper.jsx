// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './TaskTimelineWrapper.css';


export default React.createClass({
  render() {
    return (
      <div className={classes.item}>
        <div className="layout-row layout-align-start-center">
          <div className={classes.marker}></div>
          <div className="layout-row layout-align-start-center">{this.props.children}</div>
        </div>
      </div>
    )
  }
});
