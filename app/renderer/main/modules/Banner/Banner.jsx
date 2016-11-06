import React from 'react';

// Styles
import classNames from 'classnames';
import classes from './banner.css';

export default React.createClass({
  render() {
    const { children, type } = this.props;
    return (
      <div className={classNames(classes.banner, {[classes.warn]: type == 'warn'})}>
        {children}
      </div>
    )
  }
});
