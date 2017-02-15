import React from 'react';
import classes from './TextDisplayBox.css';
import classNames from 'classnames';

///////////////////////////////// COMPONENT /////////////////////////////////

export default React.createClass({
  render() {
    const { className, disabled, children, ...otherProps } = this.props;
    return (
      <div className={classNames(classes.box, 'layout-row layout-align-start-center', { [classes.disabled] : disabled },className)} { ...otherProps } >
        { children }
      </div>
    )
  }
});
