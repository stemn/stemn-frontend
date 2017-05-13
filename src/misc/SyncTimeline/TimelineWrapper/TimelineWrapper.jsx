// Component Core
import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './TimelineWrapper.scss';


export default React.createClass({
  render() {
    return (
      <div className={ classes.item } style={ this.props.style }>
        <div className="layout-row layout-align-start-center">
          <div className={ classes.marker }></div>
          <div className="layout-row layout-align-start-center">{this.props.children}</div>
        </div>
      </div>
    )
  }
});
