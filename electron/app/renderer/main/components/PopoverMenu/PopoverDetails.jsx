import React from 'react';
import classNames from 'classnames';
import classes from './PopoverDetails.css'

const PopoverDetails = React.createClass({
  render() {
    const { children } = this.props;
    return (
      <div className={classes.body} {...this.props}>
        {children}
      </div>
    );
  }
})

export default PopoverDetails;
